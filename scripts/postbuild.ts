/* eslint-disable no-console */
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';

const filePath = path.resolve(process.cwd(), 'dist/esm/helpers/cosmiconfig.js');

console.time('done');
const content = await readFile(filePath, 'utf8');

await writeFile(
  filePath,
  `
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
${content}`.trimStart(),
);
console.timeEnd('done');