import type { NextFunction, Request, RequestHandler, Response } from 'express';

export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

export function asyncHandler(fn: AsyncHandler): RequestHandler {
  return function wrappedHandler(req, res, next) {
    void fn(req, res, next).catch(next);
  };
}