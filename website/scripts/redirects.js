const { writeFileSync, mkdirSync } = require('fs');
const { resolve } = require('path');
const redirects = require('../redirects.json');

function createRedirect(redirect) {
  const { source, destination } = redirect;

  mkdirSync(resolve(__dirname, `../build/${source}`), {
    recursive: true,
  });
  writeFileSync(
    resolve(__dirname, `../build/${source}/index.html`),
    `
      <!DOCTYPE html>
      <meta charset="utf-8">
      <title>Redirecting to ${destination}</title>
      <meta http-equiv="refresh" content="0; URL=${destination}">
      <link rel="canonical" href="${destination}">
    `,
    'utf-8',
  );
}

redirects.forEach(createRedirect);
