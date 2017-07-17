import test from 'ava'
const schema = require('../schema.json')
import { GraphQLConfig } from '../../src'


test(async (t) => {
  const testURL = 'http://test.com';
  const expected = {
    "schemaPath": "../schema.json",
    "extensions": {
      "endpoint": {
        "url": testURL
      }
    }
  }

  process.env['TEST_ENDPOINT_URL'] = testURL
  const inst = new GraphQLConfig(__dirname)

  t.deepEqual(inst.config, expected)

  // clean up
  delete process.env['TEST_ENDPOINT_URL']
})
