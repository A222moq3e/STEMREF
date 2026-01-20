const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const commonOptions = {
  standardHeaders: true,
  legacyHeaders: false,
};

// Rate limiters (hard limits)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later.",
  ...commonOptions,
});

const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many login attempts, please try again later.",
  ...commonOptions,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: "Too many registration attempts, please try again later.",
  ...commonOptions,
});

const resetLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5,
  message: "Too many password reset attempts, please try again later.",
  ...commonOptions,
});

const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: "Too many search requests, slow down please.",
  ...commonOptions,
});

const courseActionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: "Too many actions, please try again later.",
  ...commonOptions,
});

// Slow-downs (gradual delays before hard blocking)
const globalSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests, then start slowing down
  delayMs: 500, // add 500ms per request above delayAfter
});

const loginSlowDown = slowDown({
  windowMs: 60 * 60 * 1000, // 1 hour
  delayAfter: 3, // after 3 attempts start slowing
  delayMs: 1000, // 1s extra per request
});

const registerSlowDown = slowDown({
  windowMs: 60 * 60 * 1000,
  delayAfter: 5,
  delayMs: 500,
});

const resetSlowDown = slowDown({
  windowMs: 24 * 60 * 60 * 1000,
  delayAfter: 2,
  delayMs: 1000,
});

const searchSlowDown = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 10,
  delayMs: 200,
});

const courseActionSlowDown = slowDown({
  windowMs: 60 * 1000,
  delayAfter: 10,
  delayMs: 200,
});

module.exports = {
  // hard limits
  globalLimiter,
  loginLimiter,
  registerLimiter,
  resetLimiter,
  searchLimiter,
  courseActionLimiter,
  // slow-downs
  globalSlowDown,
  loginSlowDown,
  registerSlowDown,
  resetSlowDown,
  searchSlowDown,
  courseActionSlowDown,
};
