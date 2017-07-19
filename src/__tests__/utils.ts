const schema = require('./schema.json')
import { createServer } from 'http'

export function serveSchema (port = 33333): Promise<any> {
  const handleRequest = (request, response) => {
    response.writeHead(200, {'Content-Type': 'application/json'})
    response.end(JSON.stringify(schema))
  }

  const server = createServer(handleRequest)

  return new Promise((resolve) => {
    server.listen(port, resolve)
  })
}
