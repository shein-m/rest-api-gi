const express = require('express');

const ctrl = require('../../controllers/contactsController');
const isValidId = require('../../middlewares/isValidId');
const validateBody = require('../../middlewares/validateBody');
const { schemas } = require('../../models/contact');

const router = express.Router();

router.get('/', ctrl.getAll);

router.get('/:contactId', isValidId, ctrl.getById);

router.post('/', validateBody(schemas.addSchema), ctrl.add);

router.delete('/:contactId', isValidId, ctrl.remove);

router.put('/:contactId', isValidId, validateBody(schemas.addSchema), ctrl.update);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(schemas.favoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;
