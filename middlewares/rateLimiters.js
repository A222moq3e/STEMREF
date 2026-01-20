const rateLimit = require("express-rate-limit");

const commonOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  ...commonOptions,
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit login attempts to 5 per hour
  message: "Too many login attempts, please try again later.",
  ...commonOptions,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit registrations to 10 per hour
  message: "Too many registration attempts, please try again later.",
  ...commonOptions,
});

const resetLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // limit password-reset/forgot attempts per day
  message: "Too many password reset attempts, please try again later.",
  ...commonOptions,
});

const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit search to 30 requests per minute
  message: "Too many search requests, slow down please.",
  ...commonOptions,
});

const courseActionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit course actions like rating to 30 per minute
  message: "Too many actions, please try again later.",
  ...commonOptions,
});

module.exports = {
  globalLimiter,
  loginLimiter,
  registerLimiter,
  resetLimiter,
  searchLimiter,
  courseActionLimiter,
};
