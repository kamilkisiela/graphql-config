import test from 'ava'
import { GraphQLProjectConfig } from '../../src'

test(async (t) => {
  const testURL = 'http://test.com'
  const expected = {
    default: {
      url: testURL,
    },
  }

  process.env['TEST_ENDPOINT_URL'] = testURL
  const inst = new GraphQLProjectConfig(__dirname)

  t.deepEqual(inst.getEndpointsMap(), expected)

  // clean up
  delete process.env['TEST_ENDPOINT_URL']
})
