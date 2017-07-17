import test from 'ava'
const schema = require('../schema.json')
import { GraphQLProjectConfig } from '../../src'


test('envs should resolve correctly', async (t) => {
  const inst = new GraphQLProjectConfig(__dirname)

  t.deepEqual(inst.getExtensions('prod').endpoint, 'http://prod')
  t.deepEqual(inst.getExtensions('dev').endpoint, 'http://dev')
})

test('getExtensions should throw if no env is specified but there are envs in config', async (t) => {
  const inst = new GraphQLProjectConfig(__dirname)
  t.throws(() => inst.getExtensions());
})

test('getExtensionsPerEnv should merge envs extensions with base extensions', async (t) => {
  const inst = new GraphQLProjectConfig(__dirname)
  const expected = {
    "prod": {
      "endpoint": "http://prod",
      "subscription-endpoint": "ws://test"
    },
    "dev": {
      "endpoint": "http://dev",
      "subscription-endpoint": "ws://test"
    }
  }

  t.deepEqual(inst.getExtensionsPerEnv(), expected);
})
