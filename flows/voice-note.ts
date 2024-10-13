import { addKeyword, EVENTS } from '@builderbot/bot'

export const voiceNoteFlow = addKeyword(EVENTS.VOICE_NOTE)
    .addAnswer("Lo siento, aún no puedo escuchar audios😅. Por favor escribe un mensaje 🤠.")
    .addAction(async (ctx, { endFlow }) => {
        return endFlow();
    })