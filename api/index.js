const app = require('../server/app.js');

module.exports = (req, res) => {
  return app(req, res);
};
