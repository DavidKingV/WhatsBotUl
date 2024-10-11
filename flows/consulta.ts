import { addKeyword, EVENTS } from '@builderbot/bot'
import { start, reset, stop } from '../src/utils/idle'
import { generatePromptFilterRFC } from "../src/utils/prompts"
import { createChatCompletion } from "~/utils/startGpt"

export const ConsultaFlow = addKeyword(EVENTS.ACTION)
    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 10000))
    .addAnswer(
        'Por favor escribe tu nombre completo 😁',
        { capture: true, }, async (ctx, { state, gotoFlow }) => { reset(ctx, gotoFlow, 10000); await state.update({ name: ctx.body })}
    )
    .addAnswer(
        'Ahora escribe tu RFC 🤔',
        { capture: true, }, async (ctx, { state, gotoFlow }) => { reset(ctx, gotoFlow, 10000); await state.update({ rfc: ctx.body })}
    )
    .addAction(async (ctx, { state, blacklist, flowDynamic, endFlow, fallBack }) => {
        const clientData = state.getMyState()
        try {
            const PromptRFC = await generatePromptFilterRFC()
            const RFCResponse = await createChatCompletion(PromptRFC, ctx.body)
            
            if(RFCResponse.includes('SUCCESS')){

                const toMute = ctx.from
                const check = blacklist.checkIf(toMute)  
                
                stop(ctx);
                if (!check) {
                    if(toMute != process.env.ADMIN_NUMBER){        
                        blacklist.add(toMute)
                        await flowDynamic([{ 
                            body: `Un momento 🙌`,
                            delay: 2000 
                        }])
                        await flowDynamic("Agradecemos tu paciencia ⌚.")
                        
                        try {
                            const response = await fetch('http://localhost:3008/v1/messages', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    number: process.env.ADMIN_NUMBER,
                                    message: "El cliente " + clientData.name +" esta solicitando la consulta de su cartera. Su RFC es: " + clientData.rfc + " Su número de teléfono es: +" + toMute
                                })
                            });
                        
                            if (!response.ok) {
                                throw new Error(`Error en la solicitud: ${response.status}`)
                            }
                        
                            const contentType = response.headers.get('content-type')
                            let responseData
                            
                            if (contentType && contentType.includes('application/json')) {
                                responseData = await response.json()
                            } else {
                                responseData = await response.text()
                            }
                        
                            console.log('Respuesta del servidor:', responseData);
                            stop(ctx)
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
                return
            }else if (RFCResponse.includes('ERROR')){
                return fallBack('Parece que hay un error en el formato de un RFC ❌. Por favor verifica que el formato sea correcto 😅.')
            }
        }catch{
            console.error("Ocurrió un error al realizar la petición a la API de OpenIA");
            return endFlow("Lo siento, ocurrio un error interno ❌. Por favor vuelve a intentarlo 😅.")
        }
    })