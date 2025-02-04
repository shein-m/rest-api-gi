const { Schema, model } = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },

  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },

  token: {
    type: String,
  },

  avatarURL: {
    type: String,
  },

  verify: {
    type: Boolean,
    default: false,
  },

  verificationCode: {
    type: String,
    required: [true, 'Verify token is required'],
  },
});

const authSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const verifySchema = Joi.object({
  email: Joi.string().required(),
});

const schemas = {
  authSchema,
  verifySchema,
};

userSchema.post('save', handleMongooseError);

const User = model('user', userSchema);

module.exports = {
  User,
  schemas,
};
