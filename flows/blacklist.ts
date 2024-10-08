import { addAnswer, addKeyword, EVENTS } from "@builderbot/bot";
import { numberClean } from "../src/utils/presence"


export const blackListFlow = addKeyword('mute')
    .addAction(async (ctx, { blacklist, flowDynamic }) => {
        if (ctx.from === `${process.env.ADMIN_NUMBER}`) {
            const toMute = numberClean(ctx.body) //Mute +34000000 message incoming
            if(toMute != process.env.ADMIN_NUMBER){
                const check = blacklist.checkIf(toMute)
                if (!check) {
                    blacklist.add(toMute)
                    await flowDynamic(`❌ ${toMute} muted`)
                    return
                }
                blacklist.remove(toMute)
                await flowDynamic(`🆗 ${toMute} unmuted`)
                return
            }else{
                await flowDynamic("No te puedes sileciar a ti mismo 😅")
            }
        }
})