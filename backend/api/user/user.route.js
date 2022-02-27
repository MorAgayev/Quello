const express = require('express');
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware');
const { log } = require('../../middlewares/logger.middleware');
const { getAll, getById, addNew, updateUser: updateItem, removeUser: removeItem } = require('./user.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth, requireAdmin);

// router.get('/', log, requireAdmin, getAll)
// router.get('/:id', requireAdmin, getById)
// router.post('/', requireAdmin, addNew)
// router.put('/:id', requireAdmin, updateItem)
// router.delete('/:id', requireAdmin, removeItem)

router.get('/', getAll)
router.get('/:id', getById)
router.post('/', addNew)
router.put('/:id', updateItem)
router.delete('/:id', removeItem)

module.exports = router;

