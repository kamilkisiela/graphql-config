import test from 'ava'
const schema = require('../schema.json')
import { GraphQLProjectConfig } from '../../src'


test('getEndpointsMap for endpoint is string url', async (t) => {
  const config = {
    schemaPath: '../schema.json',
    extensions: {
      endpoint: 'http://default'
    }
  }

  const inst = new GraphQLProjectConfig(__dirname, undefined, config)

  t.deepEqual(inst.getEndpointsMap(), { default: { url: 'http://default' }})
})

test('getEndpointsMap for endpoint is single endpoint config', async (t) => {
  const config = {
    schemaPath: '../schema.json',
    extensions: {
      endpoint: {
        url: 'http://default',
        subscription: {
          url: 'ws://test'
        }
      }
    }
  };

  const inst = new GraphQLProjectConfig(__dirname, undefined, config)

  t.deepEqual(inst.getEndpointsMap(), { default: config.extensions.endpoint })
})

test('getEndpointsMap for endpoint is endpoints map', async (t) => {
  const config = {
    schemaPath: '../schema.json',
    extensions: {
      endpoint: {
        dev: {
          url: 'http://dev',
          subscription: {
            url: 'ws://dev'
          }
        },
        prod: {
          url: 'http://prod',
          subscription: {
            url: 'ws://prod'
          }
        }
      }
    }
  }

  const inst = new GraphQLProjectConfig(__dirname, undefined, config)

  t.deepEqual(inst.getEndpointsMap(), config.extensions.endpoint)
})

// test('getExtensions should throw if no env is specified but there are envs in config', async (t) => {
//   const config = {
//     schemaPath: '../schema.json',
//     extensions: {
//       endpoint: {
//         dev: {
//           url: 'http://dev',
//           subscription: {
//             url: 'ws://dev'
//           }
//         }
//       }
//     }
//   }
//   const inst = new GraphQLProjectConfig(__dirname, undefined, config);
//   const error1 = t.throws(() => inst.resolveSchemaFromEndpoint('prod'));
//   t.regex(error1.message, /Undefined endpoint/);
//   const error2 = t.throws(() => inst.resolveSchemaFromEndpoint('default'));
//   t.regex(error2.message, /Undefined endpoint/);
// })
