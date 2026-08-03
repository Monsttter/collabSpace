import { z } from "zod";

export const shareDocumentSchema = z.object({

    email: z.string().email(),

    role: z.enum([

        "editor",

        "commenter",

        "viewer"

    ])

});

export const updateRoleSchema = z.object({

    role: z.enum([

        "editor",

        "commenter",

        "viewer"

    ])

});