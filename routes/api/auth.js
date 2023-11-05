const express = require('express');
const ctrl = require('../../controllers/authController');
const validateBody = require('../../middlewares/validateBody');
const { schemas } = require('../../models/user');
const authenticate = require('../../middlewares/authenticate');

const router = express.Router();

router.post('/register', validateBody(schemas.authSchema), ctrl.signUp);

router.post('/login', validateBody(schemas.authSchema), ctrl.signIn);

router.post('/logout', authenticate, ctrl.logout);

router.get('/current', authenticate, ctrl.current);

router.patch('/', authenticate, ctrl.subscribe);

module.exports = router;
