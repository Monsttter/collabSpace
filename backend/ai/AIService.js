import geminiProvider
    from "./providers/GeminiProvider.js";


const aiResponseSchema = {

    type: "object",

    properties: {

        type: {

            type: "string",

            enum: [
                "edit",
                "answer",
                "insert"
            ]

        },

        response: {

            type: "string"

        }

    },

    required: [
        "type",
        "response"
    ]

};


class AIService {

    async generate({

        prompt,

        context,

        documentContent

    }) {


        const systemInstruction = `

You are the AI assistant inside collabSpace.

You help users write, understand, analyze,
and improve documents.

You must determine the intent of the user's
request.

Return:

"type": "edit"

when the user wants the provided content
to be modified.

Examples:

- improve the writing
- fix grammar
- rewrite
- make professional
- make concise
- shorten
- expand
- change the tone


Return:

"type": "answer"

when the user wants an explanation,
summary, analysis, information, or answer.

Examples:

- explain
- summarize
- what does this mean?
- key points
- action items
- important decisions
- answer a question

Return "type":"insert" when the user wants newly generated
content inserted into the document at the cursor.

For "insert", return ONLY the text that should be inserted.
Do not include explanations, labels, quotes, or markdown fences.

For an "edit":

Return ONLY the replacement text.

Do not explain the changes.

Do not wrap the replacement text in
quotes or markdown fences.

Preserve the original meaning unless
the user explicitly asks you to change it.


For an "answer":

Answer the user's request normally.

Do not return replacement document
content unless the user explicitly asks
for an edit.

`;


        const aiPrompt =
            this.buildPrompt({

                prompt,

                context,

                documentContent

            });


        return await geminiProvider.generate({

            aiResponseSchema,

            systemInstruction,

            prompt:
                aiPrompt

        });

    }


    buildPrompt({

        prompt,

        context,

        documentContent

    }) {

        if (
            context.type ===
            "selection"
        ) {

            return `

The user is currently working with
the following selected text:

"""
${context.selectedText || ""}
"""


The complete current document is:

"""
${documentContent}
"""


User request:

"""
${prompt}
"""


Use the selected text as the primary
content for the request.

The rest of the document is provided
only as contextual information.

`;

        }

        if (context.type === "cursor") {
    return `
The user wants to continue writing from a specific cursor position.

Text immediately before the cursor:

"""
${context.before || ""}
"""

Text immediately after the cursor:

"""
${context.after || ""}
"""

The complete current document is:

"""
${documentContent}
"""

User request:

"""
${prompt}
"""

Continue writing naturally from the cursor position.

Important rules:
- Do not repeat text that already exists before the cursor.
- Do not repeat text that already exists after the cursor.
- Continue the existing writing style and tone.
- Maintain the language of the document.
- Return only the text that should be inserted at the cursor.
- Do not explain what you generated.
- Do not wrap the response in quotes.
`;

  }

        return `

The user is working with the current
document.

Current document:

"""
${documentContent}
"""


User request:

"""
${prompt}
"""


Use the document as the context for
answering the request.

`;

    }

}


export default new AIService();