var jsdom = require('jsdom');

module.exports = function(html) {
  return new Promise((res, rej) => {
    jsdom.env(html, (err, window) => {
      if (err) {
        return rej(err);
      }

      var ret = Array.from(
        window.document.querySelectorAll('[push]')).map((v) => {
        if (v.getAttribute('href')) {
          return v.getAttribute('href');
        }

        if (v.getAttribute('src')) {
          return v.getAttribute('src');
        }
      });

      res(ret);
    });
  });
}
