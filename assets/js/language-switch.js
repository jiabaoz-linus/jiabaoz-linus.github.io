// Keep the current section when following the link to the other language.
// The link also works without JavaScript and never overrides the English home URL.
(function () {
  var link = document.querySelector('.language-toggle');
  if (!link) return;
  var target = link.getAttribute('href');
  function updateLanguageLink() {
    link.setAttribute('href', target + window.location.hash);
  }
  updateLanguageLink();
  window.addEventListener('hashchange', updateLanguageLink);
}());
