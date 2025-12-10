import { NextFunction, Request, Response } from 'express';

const DEFAULT_INTERNAL_ERROR_MESSAGE = 'Internal server error';
const isProduction = process.env.NODE_ENV === 'production';

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, details?: unknown, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = isOperational;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }
  }
}

const normalizeError = (error: unknown): HttpError => {
  if (error instanceof HttpError) {
    return error;
  }

  if (error instanceof Error) {
    const candidate = error as Error &
      Partial<Pick<HttpError, 'statusCode' | 'details' | 'isOperational'>>;

    const normalized = new HttpError(
      candidate.message || DEFAULT_INTERNAL_ERROR_MESSAGE,
      typeof candidate.statusCode === 'number' ? candidate.statusCode : 500,
      candidate.details,
      typeof candidate.isOperational === 'boolean' ? candidate.isOperational : false,
    );
    normalized.name = candidate.name;
    normalized.stack = candidate.stack;
    return normalized;
  }

  return new HttpError(DEFAULT_INTERNAL_ERROR_MESSAGE, 500, { raw: error }, false);
};

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(
    new HttpError('Resource not found', 404, {
      method: req.method,
      path: req.originalUrl,
    }),
  );
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const httpError = normalizeError(err);
  const isServerError = httpError.statusCode >= 500;
  const shouldExposeMessage =
    !isServerError || !isProduction || httpError.isOperational;

  const responseBody: Record<string, unknown> = {
    message: shouldExposeMessage ? httpError.message : DEFAULT_INTERNAL_ERROR_MESSAGE,
    statusCode: httpError.statusCode,
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  };

  const shouldExposeDetails = !isProduction || httpError.isOperational;
  if (shouldExposeDetails && typeof httpError.details !== 'undefined') {
    responseBody.details = httpError.details;
  }

  if (!isProduction && httpError.stack) {
    responseBody.stack = httpError.stack;
  }

  if (isServerError) {
    console.error('Unhandled error in request:', {
      message: httpError.message,
      stack: httpError.stack,
      details: httpError.details,
      statusCode: httpError.statusCode,
      method: req.method,
      path: req.originalUrl,
    });
  } else {
    console.warn('Handled client error in request:', {
      message: httpError.message,
      details: httpError.details,
      statusCode: httpError.statusCode,
      method: req.method,
      path: req.originalUrl,
    });
  }

  res.status(httpError.statusCode).json(responseBody);
};
