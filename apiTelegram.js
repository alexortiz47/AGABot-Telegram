const Telegraf = require('telegraf')
const express = require('express')
const expressApp = express()

const BOT_TOKEN = '691634425:AAHD2vJ0AjCfYs526Nb7jRz1QrUyb7Kft7E'

const bot = new Telegraf(BOT_TOKEN)
expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook('https://0b94bf18.ngrok.io/secret-path')

expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})

