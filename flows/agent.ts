import { addKeyword } from '@builderbot/bot'

export const AgentFlow = addKeyword(['Agente', 'AGENTE', 'Humano'], { sensitive: true })
    .addAnswer(
        'Por favor indicame tu nombre completo 🙌',
        { capture: true, }, async (ctx, { state }) => { await state.update({ name: ctx.body })}
    )
    .addAction(async (ctx, { state, blacklist, flowDynamic, endFlow }) => {

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
                await flowDynamic([{body: "Conectando...", delay : 3000}])
                await flowDynamic([{body: "✅ Conectado", delay : 3000}])
                
                try {
                    const response = await fetch('http://localhost:3008/v1/messages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            number: process.env.ADMIN_NUMBER,  // Aquí puedes cambiar el número si lo necesitas
                            message: "Se muteado al número" + "+"+toMute    // Mensaje a enviar
                        })
                    });
            
                    if (!response.ok) {
                        throw new Error(`Error en la solicitud: ${response.status}`);
                    }
            
                    const responseData = await response.json();
                    console.log('Respuesta del servidor:', responseData);
                } catch (error) {
                    console.error('Error al hacer la llamada POST:', error);
                }

                return
            }else{
                return flowDynamic("No te puedes contactar contigo mismo 😅")
            }
        }
        blacklist.remove(toMute)
        await flowDynamic(`¿Dime como puedo ayudarte? 🤔`)
        return  
    })