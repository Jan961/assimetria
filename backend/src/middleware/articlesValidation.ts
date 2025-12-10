import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { HttpError } from './error';

const handleError = (error: unknown, next: NextFunction) => {
    if (error instanceof ZodError) {
        // Send a 400 error with validation details
        next(new HttpError('Validation Error', 400, error.issues));
    } else {
        next(error);
    }
};

export const validateBody = (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
            next();
        } catch (error) {
            handleError(error, next);
        }
    };

export const validateQuery = (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast to any to allow assigning validated types (e.g. numbers, Dates) to req.query
            req.query = schema.parse(req.query) as any;
            next();
        } catch (error) {
            handleError(error, next);
        }
    };

export const validateParams = (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Cast to any to allow assigning validated types to req.params
            req.params = schema.parse(req.params) as any;
            next();
        } catch (error) {
            handleError(error, next);
        }
    };
