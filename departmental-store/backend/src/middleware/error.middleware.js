import { env } from '../config/env.js';
import { error } from '../utils/apiResponse.js';

export const notFound = (req, res) => {
  return error(res, `Route ${req.originalUrl} not found`, 404);
};

export const errorHandler = (err, req, res, _next) => {
  console.error(err);

  if (err.name === 'ZodError') {
    return error(res, 'Validation failed', 400, err.errors);
  }

  if (err.code === 'P2002') {
    return error(res, 'Duplicate entry', 409);
  }

  const statusCode = err.statusCode || 500;
  const message =
    env.nodeEnv === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  return error(res, message, statusCode);
};
