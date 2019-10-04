const schema = require('./schema.json');
import nock from 'nock';

const body = JSON.stringify(schema);

export function serveSchema(port: number) {
  nock(`http://127.0.0.1:${port}`)
    .post('/')
    .reply(200, body, {
      'Content-Type': 'application/json',
    });
}
