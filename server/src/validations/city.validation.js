const Joi = require('joi');

const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const createCity = {
  body: Joi.object({
    name: Joi.string().trim().min(1).max(200).required(),
    state: Joi.string().trim().min(1).max(100).required(),
    slug: Joi.string().trim().max(200).allow(''),
    description: Joi.string().max(5000).allow(''),
    image: Joi.string().max(2000).allow(''),
    featured: Joi.boolean(),
    isActive: Joi.boolean(),
  }),
};

const updateCity = {
  params: Joi.object({
    id: objectId.required(),
  }),
  body: Joi.object({
    name: Joi.string().trim().min(1).max(200),
    state: Joi.string().trim().min(1).max(100),
    slug: Joi.string().trim().max(200).allow(''),
    description: Joi.string().max(5000).allow(''),
    image: Joi.string().max(2000).allow(''),
    featured: Joi.boolean(),
    isActive: Joi.boolean(),
  }).min(1),
};

const listCities = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(200).allow(''),
    state: Joi.string().trim().max(100).allow(''),
    featured: Joi.boolean(),
    isActive: Joi.boolean(),
    sortBy: Joi.string().valid('name', 'collegeCount', 'createdAt', '-name', '-collegeCount', '-createdAt'),
  }),
};

const getCity = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

const deleteCity = {
  params: Joi.object({
    id: objectId.required(),
  }),
};

module.exports = {
  createCity,
  updateCity,
  listCities,
  getCity,
  deleteCity,
};
