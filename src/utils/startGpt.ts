import { OpenAI } from 'openai';

const openai = new OpenAI();

async function createChatCompletion(systemContent: string, userContent: string, model: string = "gpt-3.5-turbo") {
    const response = await openai.chat.completions.create({
        messages: [
            { role: "system", content: systemContent },
            { role: "user", content: userContent }
        ],
        model: model
    });

    return response.choices[0].message.content;
}

export { createChatCompletion }