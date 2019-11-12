/// @ts-check
import {readFileSync} from 'fs';
import typescript from 'rollup-plugin-typescript2';

//
// Until https://github.com/vladshcherbin/rollup-plugin-generate-package-json/pull/10
// import generatePackageJson from 'rollup-plugin-generate-package-json';
//
// Do the work manually
//
import path from 'path';
import readPackage from 'read-pkg';
import writePackage from 'write-pkg';
// ^^ remove once it's ready

const produceUMD = false;

const pkg = JSON.parse(
  readFileSync('./package.json', {
    encoding: 'utf-8',
  }),
);

const common = {
  sourcemap: true,
  preferConst: true,
};

function preservePackageJson() {
  const newPkg = {};
  const fields = [
    'name',
    'version',
    'description',
    'sideEffects',
    'peerDependencies',
    'repository',
    'homepage',
    'keywords',
    'author',
    'license',
    'engines',
  ];

  fields.forEach(field => {
    newPkg[field] = pkg[field];
  });

  newPkg.main = pkg.main.replace('dist/', '');
  newPkg.module = pkg.module.replace('dist/', '');
  newPkg.typings = pkg.typings.replace('dist/', '');

  if (produceUMD) {
    newPkg.unpkg = pkg.typings.replace('dist/', '');
    newPkg.umd = pkg.typings.replace('dist/', '');
  }

  return newPkg;
}

export default {
  input: './src/index.ts',
  plugins: [
    typescript(),
    generatePackageJson({
      baseContents: preservePackageJson(),
    }),
  ],
  output: [
    {
      ...common,
      file: pkg.main,
      format: 'cjs',
    },
    {
      ...common,
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    produceUMD
      ? {
          ...common,
          file: pkg.umd,
          format: 'umd',
          name: 'graphqlConfig',
        }
      : undefined,
  ].filter(ha => ha),
};


//
// import generatePackageJson from 'rollup-plugin-generate-package-json';
//

function readPackageJson(folder) {
  try {
    const options = Object.assign({normalize: false}, folder && {cwd: folder});

    return readPackage.sync(options);
  } catch (e) {
    throw new Error(
      'Input package.json file does not exist or has bad format, check "inputFolder" option',
    );
  }
}

function writePackageJson(folder, contents) {
  try {
    return writePackage.sync(folder, contents, {indent: 2});
  } catch (e) {
    throw new Error(
      'Unable to save generated package.json file, check "outputFolder" option',
    );
  }
}

function normalizeImportModules(imports) {
  return imports.map(module => {
    const pathParts = module.split(/[/\\]/);

    return pathParts[0][0] === '@'
      ? `${pathParts[0]}/${pathParts[1]}`
      : pathParts[0];
  });
}

function generatePackageJson(options = {}) {
  const baseContents = options.baseContents || {};
  const additionalDependencies = options.additionalDependencies || [];

  return {
    name: 'generate-package-json',
    generateBundle: (outputOptions, bundle) => {
      const inputFile = readPackageJson(options.inputFolder);
      const outputFolder =
        options.outputFolder ||
        outputOptions.dir ||
        path.dirname(outputOptions.file);
      let dependencies = [];

      Object.values(bundle).forEach(chunk => {
        if (chunk.imports) {
          dependencies = [
            ...dependencies,
            ...normalizeImportModules(chunk.imports),
          ];
        }
      });

      dependencies = Array.from(
        new Set([...dependencies, ...additionalDependencies]),
      ).sort();

      const inputFileDependencies = inputFile.dependencies;
      const generatedDependencies = {};

      dependencies.forEach(dependency => {
        if (inputFileDependencies && inputFileDependencies[dependency]) {
          generatedDependencies[dependency] = inputFileDependencies[dependency];
        }
      });

      const generatedContents = Object.assign(
        {},
        baseContents,
        Object.keys(generatedDependencies).length && {
          dependencies: generatedDependencies,
        },
      );

      writePackageJson(outputFolder, generatedContents);
    },
  };
}
