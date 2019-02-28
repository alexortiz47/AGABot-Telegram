const Telegraf = require('telegraf')
const express = require('express')
const request = require('sync-request');

const expressApp = express()
let foto = 'https://drive.google.com/file/d/12wM69AkcMsofkIuXk_vZ_8h8VyPMD7lb/view?usp=sharing'

const BOT_TOKEN = '691634425:AAHD2vJ0AjCfYs526Nb7jRz1QrUyb7Kft7E'

// Aquí generamos un nuevo bot (objeto Telegraf) con el token que nos da bot_father
const bot = new Telegraf(BOT_TOKEN)
// Le generamos los comandos que queramos. Hay que poner /hello
bot.command('hello', (ctx) => ctx.reply('¡Hola! Soy AGABot🤖\n\n¿En qué puedo ayudarte?\n\nPara obtener ayuda introduce /help'))

// Comando /HELP
bot.command('help', (ctx) => ctx.reply('/hello - Inicia conversación\n\n/create - Muestra información sobre el equipo a cargo del proyecto\n\n/weather [tu ciudad] - te muestra la temperatura máxima, mínima para esa ciudad y el estado actual\n\n/whereami [tu direccion] - te devuelve la latitud y longitud de la dirección que especifiques en el comando'))

// Comando /CREATE
bot.command('create', (ctx) => ctx.replyWithPhoto(foto))

// Comando /WHEREAMI
bot.command('whereami', (ctx) => {
    let res = request('GET', 'https://geocode.xyz/madrid?json=1&auth=779248831305544628193x1897')
    return ctx.reply(`Longitud: ${JSON.parse(res.getBody('utf8')).longt}°\n\nLatitud: ${JSON.parse(res.getBody('utf8')).latt}°`)
})

// Comando /WEATHER
bot.command('weather', (ctx) => {
    let res = request('GET', 'http://api.openweathermap.org/data/2.5/weather?q=Madrid&units=metric&APPID=167c7dd8e5dbfe65b6d448c20d4ef0e0')
    return ctx.reply(`Temperatura actual: ${JSON.parse(res.getBody('utf8')).main.temp} ℃\n\nTemperatura mínima: ${JSON.parse(res.getBody('utf8')).main.temp_min} ℃\n\nTemperatura máxima: ${JSON.parse(res.getBody('utf8')).main.temp_max} ℃`)
})



expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook('https://0b94bf18.ngrok.io/secret-path')

expressApp.get('/tiempo', (req, res) => {
        request(`http://api.openweathermap.org/data/2.5/weather?q=Madrid&units=metric&APPID=167c7dd8e5dbfe65b6d448c20d4ef0e0`, function(err, response, body){
        if(err) return console.log(err.message)
        res.json(JSON.parse(body).main)
    })
})




expressApp.listen(3000, () => {
  console.log('Example app listening on port 3000!')
})


