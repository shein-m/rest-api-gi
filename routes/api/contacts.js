const express = require('express');

const ctrl = require('../../controllers/contactsController');
const isValidId = require('../../middlewares/isValidId');
const router = express.Router();

router.get('/', ctrl.getAll);

router.get('/:contactId', isValidId, ctrl.getById);

router.post('/', ctrl.add);

router.delete('/:contactId', isValidId, ctrl.remove);

router.put('/:contactId', isValidId, ctrl.update);

router.patch('/:contactId', isValidId, ctrl.updateStatusContact);

module.exports = router;
