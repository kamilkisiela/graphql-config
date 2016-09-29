import test from 'ava'
const schema = require('./schema.json')
import { createServer } from 'http'

export function serveSchema (): Promise<any> {
  const handleRequest = (request, response) => {
    response.end(JSON.stringify(schema))
  }

  const server = createServer(handleRequest)

  return new Promise((resolve) => {
    server.listen(33333, resolve)
  })
}
