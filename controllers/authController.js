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
  await User.findByIdAndUpdate(currentUser._id, { token });

  res.json({
    token,
    user: {
      email: currentUser.email,
      subscription: currentUser.subscription,
    },
  });
};

const current = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: '' });

  res.status(204).send();
};

const subscribe = async (req, res, next) => {
  const list = ['starter', 'pro', 'business'];
  const { _id } = req.user;
  const { subscription } = req.body;

  const validateSub = list.find(el => el === subscription);

  if (!validateSub) {
    throw HttpError(404);
  }

  const result = await User.findByIdAndUpdate(_id, { subscription: validateSub }, { new: true });

  res.json({ email: result.email, subscription: result.subscription });
};

module.exports = {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  subscribe: ctrlWrapper(subscribe),
};
