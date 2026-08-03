import { z } from "zod";

export const createDocumentSchema = z.object({

    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(255, "Title is too long"),

});

export const renameDocumentSchema = z.object({

    title: z
        .string()
        .trim()
        .min(1)
        .max(255),

});