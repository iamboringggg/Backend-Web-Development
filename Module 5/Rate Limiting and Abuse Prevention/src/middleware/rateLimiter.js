'use strict';
const rateLimit = require('express-rate-limit');

// The default in-memory store is not shared across load-balanced instances;
// rate-limit-redis can replace it with a shared Redis store.
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
