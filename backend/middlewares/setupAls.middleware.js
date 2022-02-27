const logger = require('../service/logger.service');
const asyncLocalStorage = require('../service/als.service');

async function setupAsyncLocalStorage(req, res, next) {
  const storage = {};
  asyncLocalStorage.run(storage, () => {
    if (req.sessionID) {
      const alsStore = asyncLocalStorage.getStore();
      alsStore.sessionId = req.sessionID;
      if (req.session.user) {
        alsStore.userId = req.session.user._id;
        alsStore.isAdmin = req.session.user.isAdmin;
      }
    }
    next();
  })
}

module.exports = setupAsyncLocalStorage;

