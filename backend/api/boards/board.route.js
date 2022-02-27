const express = require('express');
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware');
const { requirePremission, getAll, getById, addBoard, updateBoard, removeBoard, setList, setCard, setItem, removeList, removeCard, removeItem, setActivity, removeActivity, sortBoard } = require('./board.controller');
const router = express.Router();

// middleware that is specific to this router
// router.use(requireAuth, requireAdmin);

// router.get('/', log, requireAdmin, getAll)
// router.get('/:id', requireAdmin, getById)
// router.post('/', requireAdmin, addNew)
// router.put('/:id', requireAdmin, updateItem)
// router.delete('/:id', requireAdmin, removeItem)

router.get('/', requireAuth, getAll);
router.get('/:id', requirePremission, getById);

router.post('/', requireAuth, addBoard);
router.post('/activity/', requirePremission, setActivity);

router.put('/list/', requirePremission, setList);
router.put('/card/', requirePremission, setCard);
router.put('/item/', requirePremission, setItem);
router.put('/sort/:id', requirePremission, sortBoard);
router.put('/:id', requirePremission, updateBoard);

router.delete('/activity', requirePremission, removeActivity);
router.delete('/list', requirePremission, removeList);
router.delete('/card', requirePremission, removeCard);
router.delete('/item', requirePremission, removeItem);
router.delete('/:id', requirePremission, removeBoard);

module.exports = router;

