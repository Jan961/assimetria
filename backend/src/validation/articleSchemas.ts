import { z } from 'zod';

export const listArticlesQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1).catch(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10).catch(10),
    sortDirection: z.enum(['asc', 'desc']).default('desc').catch('desc'),
});

export const getArticlesByDatesQuerySchema = listArticlesQuerySchema.extend({
    from: z.coerce.date().catch(new Date(0)), // Default to epoch if invalid? Or maybe just fail? usage implies "insert default values if ... invalid" 
    // But for dates, "invalid" might mean missing. If user provides "invalid-date", defaulting to something valid is what requested.
    // However, defaulting 'from' to epoch and 'to' to now seems reasonable if invalid.
    to: z.coerce.date().catch(() => new Date()),
});
// Using catch with a function for 'to' to get current time at execution.

export const getArticleByIdParamsSchema = z.object({
    id: z.coerce.number().int().positive(), // ID shouldn't use default usually, but if invalid (e.g. 'abc') it might be 400.
    // "The validation should insert default values if the provided parameters etc are invalid."
    // For ID in params, if I pass 'abc', replacing it with a default ID seems wrong for a specific resource request. 
    // It might be better to let it fail or catch to something that will result in 404 cleanly? 
    // But standard middleware usually throws 400 for validation error. 
    // The user requirement "insert default values" is mostly amenable to query params (page, limits). 
    // For path params, like :id, if it's invalid, the route might not match or validation should fail.
    // I will leave ID validation strict for now as replacing 'abc' with '1' is dangerous/confusing.
    // BUT the prompt says "allow all other functions ... to assume correct input".
    // I'll keep it strict for ID.
});

export const createArticleSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    photoUrl: z.string().refine((val) => {
        try {
            new URL(val);
            return true;
        } catch {
            return false;
        }
    }, { message: "Invalid URL" }).nullish(),
});

export const updateArticleParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});

export const updateArticleSchema = z.object({
    title: z.string().min(1).optional(),
    content: z.string().min(1).optional(),
    photoUrl: z.string().refine((val) => {
        try {
            new URL(val);
            return true;
        } catch {
            return false;
        }
    }, { message: "Invalid URL" }).nullish().optional(),
});

export const deleteArticleParamsSchema = z.object({
    id: z.coerce.number().int().positive(),
});
