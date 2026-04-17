const asyncHandler = require('../middlewares/asyncHandler');
const cityService = require('../services/city.service');
const ApiResponse = require('../utils/ApiResponse');

const createCity = asyncHandler(async (req, res) => {
  const city = await cityService.createCity(req.body, req.user._id);
  ApiResponse.created(res, 'City created successfully', city);
});

const getCities = asyncHandler(async (req, res) => {
  const options = {
    page: req.query.page,
    limit: req.query.limit,
    sort: req.query.sort,
  };

  const result = await cityService.getCities(req.query, options);
  ApiResponse.paginated(res, 'Cities retrieved successfully', result);
});

const getCityById = asyncHandler(async (req, res) => {
  const city = await cityService.getCityById(req.params.id);
  ApiResponse.success(res, 'City retrieved successfully', city);
});

const updateCity = asyncHandler(async (req, res) => {
  const city = await cityService.updateCity(req.params.id, req.body);
  ApiResponse.success(res, 'City updated successfully', city);
});

const deleteCity = asyncHandler(async (req, res) => {
  await cityService.deleteCity(req.params.id);
  ApiResponse.success(res, 'City deleted successfully');
});

module.exports = {
  createCity,
  getCities,
  getCityById,
  updateCity,
  deleteCity,
};
