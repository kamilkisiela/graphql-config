/// @ts-check
const {execSync} = require('child_process');
const {resolve} = require('path');
const {readFileSync, writeFileSync} = require('fs');

const cwd = process.cwd();
const commitId = execSync(`git rev-parse --short HEAD`, {
  encoding: 'utf-8',
}).replace('\n', '');

const pkgPath = resolve(cwd, 'dist/package.json');
const uuid = Math.random().toString(16).substr(2, 3);

const pkg = JSON.parse(
  readFileSync(pkgPath, {
    encoding: 'utf-8',
  }),
);

const before = pkg.version;
const now = `0.0.0-experimental-${commitId}.${uuid}`;

pkg.version = now;

console.log(`
Version changed ${before} => ${now}
`)

writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), {
  encoding: 'utf-8',
});
