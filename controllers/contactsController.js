const { Contact } = require('../models/contact');
const HttpError = require('../helpers/HttpError');
const { ctrlWrapper } = require('../helpers');

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;

  // pagination
  const { page = 1, limit = 20, favorite = null } = req.query;
  const skip = (page - 1) * limit;

  // filter contacts by favorite field
  const searchParams = favorite !== null ? { owner, favorite } : { owner };

  const result = await Contact.find({ ...searchParams }, null, { skip, limit });
  res.json(result);
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    throw HttpError(404, 'Not Found');
  }

  res.json(result);
};

const add = async (req, res, next) => {
  const { _id: owner } = req.user;

  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);

  if (!result) {
    throw HttpError(404, 'Not Found');
  }

  res.status(200).json({ message: 'contact deleted' });
};

const update = async (req, res, next) => {
  const { contactId } = req.params;

  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, 'missing field');
  }

  const result = await Contact.findByIdAndUpdate(contactId, req.body);
  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;

  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, 'missing field favorite');
  }

  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if (!result) {
    throw HttpError(404, 'Not found');
  }

  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  remove: ctrlWrapper(remove),
  update: ctrlWrapper(update),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
