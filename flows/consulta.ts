import { addKeyword } from '@builderbot/bot'
import { start, reset, stop } from '../src/utils/idle'

export const ConsultaFlow = addKeyword(['Consultar cartera', 'Consultar pagos', 'consultar cartera'])
    .addAction(async (ctx, { gotoFlow }) => start(ctx, gotoFlow, 10000))
    .addAnswer(
        'Por favor escribe tu RFC 🤔',
        { capture: true, }, async (ctx, { state, gotoFlow }) => { reset(ctx, gotoFlow, 10000); await state.update({ rfc: ctx.body })}
    )
    .addAction(async (ctx, { state, blacklist, flowDynamic, endFlow }) => {
        
        const clientRFC = state.getMyState()
        const toMute = ctx.from //Mute +34000000 message incoming
        const check = blacklist.checkIf(toMute)  
                  
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
                            message: "El cliente " + ctx.name +" esta solicitando la consulta de su cartera. Su RFC es: " + clientRFC.rfc + " Su número de teléfono es: +" + toMute
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
            }            
        }
        blacklist.remove(toMute)
        await flowDynamic(`¿Dime como puedo ayudarte? 🤔`) 
        return
    })