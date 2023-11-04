const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models/user');
const HttpError = require('../helpers/HttpError');
const { ctrlWrapper } = require('../helpers');

const { SECRET_KEY } = process.env;

const signUp = async (req, res, next) => {
  const { password, email } = req.body;
  const currentUser = await User.findOne({ email });

  if (currentUser) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const result = await User.create({ email: req.body.email, password: hashPassword });

  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
};

const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const currentUser = await User.findOne({ email });

  if (!currentUser) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const comparePassword = await bcrypt.compare(password, currentUser.password);

  if (!comparePassword) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const token = jwt.sign({ id: currentUser._id }, SECRET_KEY, { expiresIn: '23h' });

  res.json({
    token,
    user: {
      email: currentUser.email,
      subscription: currentUser.subscription,
    },
  });
};

module.exports = {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
};
