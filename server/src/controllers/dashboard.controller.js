const asyncHandler = require('../middlewares/asyncHandler');
const dashboardService = require('../services/dashboard.service');
const ApiResponse = require('../utils/ApiResponse');

const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  ApiResponse.success(res, 'Dashboard stats retrieved successfully', stats);
});

const getLeadPipeline = asyncHandler(async (req, res) => {
  const pipeline = await dashboardService.getLeadPipeline();
  ApiResponse.success(res, 'Lead pipeline retrieved successfully', pipeline);
});

const getRecentActivity = asyncHandler(async (req, res) => {
  const activity = await dashboardService.getRecentActivity();
  ApiResponse.success(res, 'Recent activity retrieved successfully', activity);
});

module.exports = {
  getStats,
  getLeadPipeline,
  getRecentActivity,
};
