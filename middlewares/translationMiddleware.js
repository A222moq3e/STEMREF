const i18next = require('i18next');
const { JSDOM } = require('jsdom');

function translateHTML(html, lng) {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  function translateTextNode(node) {
    if (node.nodeType === node.TEXT_NODE && node.nodeValue.trim()) {
      const translatedText = i18next.t(node.nodeValue.trim(), { lng });
      node.nodeValue = translatedText;
    }
  }

  function traverseNodes(node) {
    node.childNodes.forEach((child) => {
      if (child.nodeType === child.TEXT_NODE) {
        translateTextNode(child);
      } else {
        traverseNodes(child);
      }
    });
  }

  traverseNodes(document.body);

  return dom.serialize();
}

module.exports = (req, res, next) => {
  const originalRender = res.render;

  res.render = function (view, options, callback) {
    originalRender.call(res, view, options, (err, html) => {
      if (err) return callback ? callback(err) : next(err);

      const translatedHtml = translateHTML(html, req.language);
      callback ? callback(null, translatedHtml) : res.send(translatedHtml);
    });
  };

  next();
};