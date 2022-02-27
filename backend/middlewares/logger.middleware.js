const logger = require('../service/logger.service');

async function log(req, res, next) {
  if (req.session && req.session.user) {
    logger.info('Req from: ' + req.session.user.fullname);
  }
  next();
}

module.exports = {
  log
}
