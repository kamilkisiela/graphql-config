import test from 'ava'
import { writeFileSync, unlinkSync, readFileSync } from 'fs'
import { join } from 'path'
import { parse, resolveSchema } from '../../src'
const schema = require('../schema.json')

function createPackageJson(fileName) {
  const content = {
    graphql: {
      "graphql-js": fileName
    }
  }
  writeFileSync('package.json', JSON.stringify(content))
}

test.afterEach(() => {
  delete require.cache[join(process.cwd(), 'package.json')]
  unlinkSync('package.json')
})

test(async t => {
  createPackageJson('schema.js')
  const config = parse()
  const resolvedSchema = await resolveSchema(config)

  t.deepEqual(resolvedSchema, schema)
})

test(async t => {
  createPackageJson('schema-es6.js')
  const config = parse()
  const resolvedSchema = await resolveSchema(config)

  t.deepEqual(resolvedSchema, schema)
})

