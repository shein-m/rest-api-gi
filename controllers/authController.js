const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises');
const Jimp = require('jimp');
const path = require('path');
const gravatar = require('gravatar');

const { User } = require('../models/user');
const HttpError = require('../helpers/HttpError');
const { ctrlWrapper } = require('../helpers');

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const signUp = async (req, res, next) => {
  const { password, email } = req.body;
  const currentUser = await User.findOne({ email });

  if (currentUser) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const result = await User.create({ email: req.body.email, password: hashPassword, avatarURL });

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

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;

  const resultUpload = path.join(avatarsDir, filename);

  // change size image
  try {
    const img = await Jimp.read(tempUpload);
    await img.resize(250, 250);
    await img.write(tempUpload);
  } catch (err) {
    next(err);
  }

  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join('avatars', filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

module.exports = {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  current: ctrlWrapper(current),
  logout: ctrlWrapper(logout),
  subscribe: ctrlWrapper(subscribe),
  updateAvatar: ctrlWrapper(updateAvatar),
};
