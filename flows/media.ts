import { addKeyword, EVENTS } from '@builderbot/bot'

export const mediaFlow = addKeyword(EVENTS.MEDIA)
    .addAnswer("Lo siento, aún no puedo procesar imágenes o videos 😅.")
    .addAction(async (ctx, { endFlow }) => {
        return endFlow();
    })