import test from 'ava'
import { writeFileSync, unlinkSync } from 'fs';
const schema = require('../schema.json')
import { parse, resolveSchema } from '../../src'

function createPackageJson(fileName) {
  const content = {
    graphql: {
      "graphql-js": fileName
    }
  }
  writeFileSync('package.json', JSON.stringify(content));
}

test.after(() => {
  unlinkSync('package.json');
})

test(async t => {
  createPackageJson('schema.js');
  const config = parse()
  const resolvedSchema = await resolveSchema(config)

  t.deepEqual(resolvedSchema, schema)
})

test(async t => {
  createPackageJson('schema-es6.js');
  const config = parse()
  const resolvedSchema = await resolveSchema(config)

  t.deepEqual(resolvedSchema, schema)
})

