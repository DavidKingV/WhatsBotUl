import { OpenAI } from 'openai';

const openai = new OpenAI();

async function createChatCompletion(systemContent: string, userContent: string, model: string = "gpt-3.5-turbo") {
    try {
        const response = await openai.chat.completions.create({
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: userContent }
            ],
            model: model
        });
        
        // Verifica si la respuesta tiene el formato esperado
        if (response && response.choices && response.choices.length > 0) {
            return response.choices[0].message.content;
        } else {
            throw new Error("La respuesta de la API no tiene el formato esperado.");
        }
    } catch (error) {
        // Manejo de errores
        console.error("Error en la creación del chat:", error.message || error);
        return `Ocurrió un error: ${error.message || "desconocido"}`;
    }
}

export { createChatCompletion };
