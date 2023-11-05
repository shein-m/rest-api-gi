const express = require('express');

const ctrl = require('../../controllers/contactsController');
const isValidId = require('../../middlewares/isValidId');
const validateBody = require('../../middlewares/validateBody');
const { schemas } = require('../../models/contact');
const authenticate = require('../../middlewares/authenticate');

const router = express.Router();

router.get('/', authenticate, ctrl.getAll);

router.get('/:contactId', authenticate, isValidId, ctrl.getById);

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.add);

router.delete('/:contactId', authenticate, isValidId, ctrl.remove);

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema), ctrl.update);

router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  validateBody(schemas.favoriteSchema),
  ctrl.updateStatusContact
);

module.exports = router;
