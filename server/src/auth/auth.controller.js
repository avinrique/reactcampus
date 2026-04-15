const authService = require('./auth.service');
const User = require('../models/User.model');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

const REFRESH_COOKIE = 'refreshToken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);
  ApiResponse.created(res, 'Registration successful', {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);
  ApiResponse.success(res, 'Login successful', {
    user: result.user,
    accessToken: result.accessToken,
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  // Read refresh token from cookie first, fall back to body for backward compat
  const token = req.cookies?.[REFRESH_COOKIE] || req.body.refreshToken;
  if (!token) {
    throw new ApiError(400, 'Refresh token is required');
  }
  const result = await authService.refresh(token);
  res.cookie(REFRESH_COOKIE, result.refreshToken, COOKIE_OPTIONS);
  ApiResponse.success(res, 'Token refreshed', {
    accessToken: result.accessToken,
  });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE] || req.body.refreshToken;
  await authService.logout(token);
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
  ApiResponse.success(res, 'Logged out successfully');
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'roles',
    select: 'name displayName',
  });
  ApiResponse.success(res, 'Profile retrieved', { user, permissions: req.permissions });
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) throw new ApiError(404, 'User not found');
  ApiResponse.success(res, 'Profile updated', user);
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
  ApiResponse.success(res, 'Password changed successfully');
});

module.exports = { register, login, refreshToken, logout, me, updateProfile, changePassword };
