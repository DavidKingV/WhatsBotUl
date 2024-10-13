import { addKeyword, EVENTS } from '@builderbot/bot'
  
export const documentFlow = addKeyword(EVENTS.DOCUMENT)
    .addAnswer("Lo siento, aún no puedo recibir documentos 😅.")
    .addAction(async (ctx, { endFlow }) => {
        return endFlow();
    })