const express = require('express');
const ctrl = require('../../controllers/authController');
const validateBody = require('../../middlewares/validateBody');
const { schemas } = require('../../models/user');

const router = express.Router();

router.post('/register', validateBody(schemas.authSchema), ctrl.signUp);

router.post('/login', validateBody(schemas.authSchema), ctrl.signIn);

module.exports = router;
