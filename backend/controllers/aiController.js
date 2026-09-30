import aiService
    from "../ai/AIService.js";


export async function generateAI(
    req,
    res,
    next
) {

    try {

        const {
            prompt,
            context,
            documentContent
        } = req.body;


        if (
            !prompt ||
            !prompt.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Prompt is required"

            });

        }

        if (
            !context ||
            !["selection", "document", "cursor"]
                .includes(context.type)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid AI context"

            });

        }

        if (
            typeof documentContent !==
            "string"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Document content is required"

            });

        }


        const result =
            await aiService.generate({

                prompt:
                    prompt.trim(),

                context,

                documentContent

            });


        return res.status(200).json({

            success: true,

            data: {

                type:
                    result.type,

                response:
                    result.response

            }

        });

    } catch (error) {

        next(error);

    }

}