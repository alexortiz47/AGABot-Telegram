const Telegraf = require('telegraf')
const express = require('express')
const expressApp = express()

const BOT_TOKEN = '691634425:AAHD2vJ0AjCfYs526Nb7jRz1QrUyb7Kft7E'

// Aquí generamos un nuevo bot (objeto Telegraf) con el token que nos da bot_father
const bot = new Telegraf(BOT_TOKEN)
// Le generamos los comandos que queramos. Hay que poner /hello
bot.command('hello', (ctx) => ctx.reply('¡Hola! Soy AGABot🤖\n\n¿En qué puedo ayudarte?\n\nPara obtener ayuda introduce /help'))
bot.command('help', (ctx) => ctx.reply('/hello - Inicia conversación\n\n/create - Muestra información sobre el equipo a cargo del proyecto\n\n/weather [tu ciudad] - te muestra la temperatura máxima, mínima para esa ciudad y el estado actual\n\n/whereami [tu direccion] - te devuelve la latitud y longitud de la dirección que especifiques en el comando'))


expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook('https://0b94bf18.ngrok.io/secret-path')


expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})


