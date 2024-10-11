import "dotenv/config"
import { addKeyword, EVENTS, } from '@builderbot/bot'
import { toAsk } from "@builderbot-plugins/openai-assistants"
import { createMessageQueue, QueueConfig } from "../src/utils/fast-entires"
import { generatePromptFilterSearch } from "~/utils/prompts"
import { ConsultaFlow } from "./consulta"
import  { AgentFlow } from "./agent"
import { createChatCompletion } from "~/utils/startGpt"

const ASSISTANT_ID = process.env?.ASSISTANT_ID ?? ''
const userQueues = new Map();
const userLocks = new Map(); // New lock mechanism

const queueConfig: QueueConfig = { gapMilliseconds: 3000 };
const enqueueMessage = createMessageQueue(queueConfig);

const processUserMessage = async (ctx, { flowDynamic, gotoFlow, endFlow, state, provider })=> {
    try {
        enqueueMessage(ctx, async (body) => {

            const promptWelcome = await generatePromptFilterSearch();
            const completionResponse = await createChatCompletion(promptWelcome, body)

            if(completionResponse.includes('HABLAR')){

                await provider.vendor.sendPresenceUpdate('composing', ctx.key.remoteJid)
                const response = await toAsk(ASSISTANT_ID, body, state);
        
                // Split the response into chunks and send them sequentially
                const chunks = response.split(/\n\n+/);
                for (const chunk of chunks) {
                    const cleanedChunk = chunk.trim().replace(/【.*?】[ ] /g, "");
                    await flowDynamic([{ body: cleanedChunk }]);
                }
            }else if(completionResponse.includes('BUSCAR')){
                return gotoFlow(ConsultaFlow)
            }else if(completionResponse.includes('AGENTE')){
                return gotoFlow(AgentFlow)
            }else{
                await flowDynamic('Por favor indicame en que puedo ayudarte 🙌');
            }
        })
    }catch (error) {
        console.error('Error processing message:', error);
        return endFlow("Lo siento, estoy teniendo porblemas para entenderte 😓. Por favor intenta de nuevo en unos momentos 😅.")
    }
};

const handleQueue = async (userId) => {
    const queue = userQueues.get(userId);
    
    if (userLocks.get(userId)) {
        return; // If locked, skip processing
    }

    while (queue.length > 0) {
        userLocks.set(userId, true); // Lock the queue
        const { ctx, flowDynamic, gotoFlow, endFlow, state, provider } = queue.shift();
        try {
            await processUserMessage(ctx, { flowDynamic, gotoFlow, endFlow, state, provider });
        } catch (error) {
            console.error(`Error processing message for user ${userId}:`, error);
        } finally {
            userLocks.set(userId, false); // Release the lock
        }
    }

    userLocks.delete(userId); // Remove the lock once all messages are processed
    userQueues.delete(userId); // Remove the queue once all messages are processed
};

export const WelcomeFlow = addKeyword(EVENTS.WELCOME)
    .addAction(async (ctx, { flowDynamic, state, provider, gotoFlow }) => {
        const userId = ctx.from; // Use the user's ID to create a unique queue for each user

        if (!userQueues.has(userId)) {
            userQueues.set(userId, []);
        }

        const queue = userQueues.get(userId);
        queue.push({ ctx, flowDynamic, state, provider, gotoFlow });

        // If this is the only message in the queue, process it immediately
        if (!userLocks.get(userId) && queue.length === 1) {
            await handleQueue(userId);
        }
    });
    

