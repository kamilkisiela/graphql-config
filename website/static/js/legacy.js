window.addEventListener('load', function () {
  const body = document.getElementsByTagName('body')[0];
  const legacyNote = document.createElement('div');

  legacyNote.setAttribute('id', 'legacy-note');

  legacyNote.innerHTML = `
    <span class="important">Important:</span>
    This documentation covers GraphQL Config v3. For the 2.x doc, check
    <a href="https://graphql-config.com/legacy">graphql-config.com/legacy</a>.
  `;

  body.prepend(legacyNote);

  body.classList.add('legacy-note');
});
