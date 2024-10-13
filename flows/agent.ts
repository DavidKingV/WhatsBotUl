import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '../src/utils/idle'
import { generatePromptFilterRFC, generatePromptFilterAfirmation } from "../src/utils/prompts"
import { createChatCompletion } from "~/utils/startGpt"

export const AgentFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 10000))
    .addAnswer(
        'Por favor indicame tu nombre completo 🙌',
        { capture: true, }, async (ctx, { state, gotoFlow }) => { reset(ctx, gotoFlow, 10000); await state.update({ name: ctx.body })}
    )
    .addAnswer('Puedes contactarnos de manera rápida y sencilla al número: 5661965119📲')
    .addAnswer('Si deseas que te atendamos por este medio, por favor responde con un *"SI"* 🙌.', 
        { capture: true, }, async (ctx, { state, gotoFlow }) => { reset(ctx, gotoFlow, 10000); await state.update({ response: ctx.body })})     
    .addAction(async (ctx, { state, blacklist, flowDynamic, endFlow, fallBack, gotoFlow }) => { reset(ctx, gotoFlow, 10000); await state.update({ response: ctx.body })
        const response = state.getMyState()

        try {
            const PromptAfirmation = await generatePromptFilterAfirmation()
            const AfirmationResponse = await createChatCompletion(PromptAfirmation, response.response)
            stop(ctx)
            if(AfirmationResponse.includes('SI')){
                const myState = state.getMyState()
                const toMute = ctx.from //Mute +34000000 message incoming
                const check = blacklist.checkIf(toMute)

                if (!check) {
                    if(toMute != process.env.ADMIN_NUMBER){        
                        blacklist.add(toMute)
                        await flowDynamic([{ 
                            body: `Un momento, ${myState.name} 🙌`,
                            delay: 2000 
                        }])
                        await flowDynamic("Te estoy trasnfiriendo, por favor, espera 🕒.")
                        await flowDynamic([{body: "Un agente te atenderá lo antes posible 👨‍💼.", delay : 3000}])
                        
                        try {
                            const response = await fetch('http://localhost:3008/v1/messages', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    number: process.env.ADMIN_NUMBER,
                                    message: "El cliente " + ctx.name +" esta solicitando la ayuda de un agente humano. Su telefono es: +" + toMute
                                })
                            });
                        
                            if (!response.ok) {
                                throw new Error(`Error en la solicitud: ${response.status}`);
                            }
                        
                            const contentType = response.headers.get('content-type');
                            let responseData;
                            
                            if (contentType && contentType.includes('application/json')) {
                                responseData = await response.json(); // Solo parsea si es JSON
                            } else {
                                responseData = await response.text(); // Obtén la respuesta como texto si no es JSON
                            }
                        
                            console.log('Respuesta del servidor:', responseData);
                            stop(ctx);
                        } catch (error) {
                            console.error('Error al hacer la llamada POST:', error);
                        }
                        return
                    }else{
                        await flowDynamic("No te puedes contactar contigo mismo 😅")
                        return endFlow()
                    }            
                }
                blacklist.remove(toMute)
                await flowDynamic(`¿Dime como puedo ayudarte? 🤔`) 
                return endFlow()
            }else if(AfirmationResponse.includes('NO')){
                await flowDynamic("Con gusto te comparto de nuevo nuestros teléfonos de oficina 😁")
                return endFlow();
            }else{
                return fallBack('No recibí correctamenrte tu respuesta. Por favor responde con un *"SI"* o un *"NO"* 🙌')
            }
        }catch{
            console.error("Ocurrió un error al realizar la petición a la API de OpenIA");
            return endFlow("Lo siento, ocurrio un error interno ❌. Por favor vuelve a intentarlo 😅.")
        }
    })