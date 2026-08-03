import { z } from "zod";

export const registerSchema = z.object({

    username: z
        .string()
        .trim()
        .min(2)
        .max(100),

    email: z
        .string()
        .email(),

    password: z
        .string()
        .min(3)
        .max(100)

});

export const loginSchema = z.object({

    email: z
        .string()
        .email(),

    password: z
        .string()
        .min(3)

});

export const updateProfileSchema = z.object({

    name: z
        .string()
        .trim()
        .min(2)
        .max(100),

    avatarUrl: z
        .string()
        .url()
        .optional()

});

export const changePasswordSchema = z.object({

    currentPassword: z
        .string()
        .min(3),

    newPassword: z
        .string()
        .min(3)

});