import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'
import { flow } from '../flows/index'

const PORT = process.env.PORT ?? 3008

const main = async () => {
    const adapterFlow = flow
    const adapterProvider = createProvider(Provider, { 
        experimentalStore: true, 
        timeRelease: 10800000,    
    })
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,  
    })

    httpServer(+PORT)

    adapterProvider.server.post('/v1/messages', handleCtx(async (bot, req, res) => {
        const { number, message } = req.body
        await bot.sendMessage(number, message, {})
        return res.end('send')
        }) 
    )
}

main()
