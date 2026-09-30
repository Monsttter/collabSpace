import { GoogleGenAI } from "@google/genai";


class GeminiProvider {

    constructor() {

        if (!process.env.GEMINI_API_KEY) {

            throw new Error(
                "GEMINI_API_KEY is not configured"
            );

        }

        this.client =
            new GoogleGenAI({
                apiKey:
                    process.env.GEMINI_API_KEY
            });

        this.model =
            process.env.GEMINI_MODEL ||
            "gemini-3.7-flash";
    }


    async generate({
        systemInstruction,
        prompt,
        aiResponseSchema
    }) {
        
        const response =
        await this.client.models.generateContent({
            
            model: this.model,
            
            contents: prompt,
            
            config: {
                
                responseMimeType: "application/json",
                
                responseSchema: aiResponseSchema,

                systemInstruction,
                
                // temperature: 0.4,
                
                // maxOutputTokens: 2048
                
            }
            
        });


        return JSON.parse(response.text);
    }

}


export default new GeminiProvider();