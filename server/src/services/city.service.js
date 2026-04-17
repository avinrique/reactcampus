const City = require('../models/City.model');
const College = require('../models/College.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/ApiError');
const { paginate } = require('../utils/pagination');
const { ensureUniqueSlug } = require('../utils/slugify');

/**
 * Create a new city.
 */
const createCity = async (data, userId) => {
  const slug = await ensureUniqueSlug(City, data.name);

  const city = await City.create({
    ...data,
    slug,
    createdBy: userId,
  });

  await AuditLog.create({
    user: userId,
    action: 'created',
    resource: 'city',
    resourceId: city._id,
    details: { name: city.name, slug: city.slug },
  });

  return city;
};

/**
 * Get paginated list of cities.
 */
const getCities = async (query = {}, options = {}) => {
  const filter = {};

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.state) {
    filter.state = { $regex: query.state, $options: 'i' };
  }

  if (query.featured !== undefined) {
    filter.featured = query.featured;
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive;
  }

  return paginate(City, filter, {
    page: options.page,
    limit: options.limit,
    sort: options.sort || { createdAt: -1 },
    select: options.select,
  });
};

/**
 * Get a single city by ID.
 */
const getCityById = async (id) => {
  const city = await City.findById(id)
    .populate('createdBy', 'firstName lastName');

  if (!city) {
    throw new ApiError(404, 'City not found');
  }

  return city;
};

/**
 * Get a single city by slug.
 */
const getCityBySlug = async (slug) => {
  const city = await City.findOne({ slug })
    .populate('createdBy', 'firstName lastName');

  if (!city) {
    throw new ApiError(404, 'City not found');
  }

  return city;
};

/**
 * Update a city.
 */
const updateCity = async (id, data, userId = null) => {
  const city = await City.findById(id);
  if (!city) {
    throw new ApiError(404, 'City not found');
  }

  // Re-generate slug if name changes
  if (data.name && data.name !== city.name) {
    data.slug = await ensureUniqueSlug(City, data.name, city._id);
  }

  Object.assign(city, data);
  await city.save();

  await AuditLog.create({
    user: userId,
    action: 'updated',
    resource: 'city',
    resourceId: city._id,
    details: { updatedFields: Object.keys(data) },
  });

  return city;
};

/**
 * Delete a city (actual delete, not soft delete).
 */
const deleteCity = async (id, userId = null) => {
  const city = await City.findById(id);
  if (!city) {
    throw new ApiError(404, 'City not found');
  }

  await city.deleteOne();

  await AuditLog.create({
    user: userId,
    action: 'deleted',
    resource: 'city',
    resourceId: city._id,
    details: { name: city.name },
  });

  return city;
};

/**
 * Update the collegeCount field by counting published colleges with matching location.city.
 */
const updateCollegeCount = async (cityName) => {
  const count = await College.countDocuments({
    'location.city': { $regex: `^${cityName}$`, $options: 'i' },
    status: 'published',
    deletedAt: null,
  });

  await City.findOneAndUpdate(
    { name: { $regex: `^${cityName}$`, $options: 'i' } },
    { collegeCount: count }
  );

  return count;
};

module.exports = {
  createCity,
  getCities,
  getCityById,
  getCityBySlug,
  updateCity,
  deleteCity,
  updateCollegeCount,
};
