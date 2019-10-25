/// @ts-check
import {readFileSync} from 'fs';
import typescript from 'rollup-plugin-typescript2';
import generatePackageJson from 'rollup-plugin-generate-package-json';

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
