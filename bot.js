const Telegraf = require('telegraf')
const express = require('express')
const request = require('sync-request');
const googleTTS = require('google-tts-api')

const expressApp = express()
let foto = 'https://drive.google.com/file/d/12wM69AkcMsofkIuXk_vZ_8h8VyPMD7lb/view?usp=sharing'

const BOT_TOKEN = '691634425:AAHD2vJ0AjCfYs526Nb7jRz1QrUyb7Kft7E'

const nlu = require('./nlu')
const dialog = require('./dialog')

// Aquí generamos un nuevo bot (objeto Telegraf) con el token que nos da bot_father
const bot = new Telegraf(BOT_TOKEN)

expressApp.use(bot.webhookCallback('/secret-path'))
bot.telegram.setWebhook('https://aganeobot.herokuapp.com/secret-path')

expressApp.get('/tiempo', (req, res) => {
    
})

// Le generamos los comandos que queramos
bot.command('start', (ctx) => {
    let nombre = ctx.message.from.first_name // Esto saca el nombre del usuario de la cuenta telegram desde donde se interactua con el bot
    
    return ctx.reply(`¡Hola ${nombre}! Soy AGABot 🤖\n\n¿En qué puedo ayudarte?\n\nPara obtener ayuda introduce /help`)
})
bot.command('hello', (ctx) => {
    let nombre = ctx.message.from.first_name // Esto saca el nombre del usuario de la cuenta telegram desde donde se interactua con el bot
    
    return ctx.reply(`¡Hola ${nombre}! Soy AGABot 🤖\n\n¿En qué puedo ayudarte?\n\nPara obtener ayuda introduce /help`)
})

// Comando /HELP
bot.command('help', (ctx) => ctx.reply('/hello - Inicia conversación\n\n/create - Muestra información sobre el equipo a cargo del proyecto\n\n/weather [tu ciudad] - te muestra la temperatura máxima, mínima para esa ciudad y el estado actual\n\n/whereami [tu direccion] - te devuelve la latitud y longitud de la dirección que especifiques en el comando'))

// Comando /CREATE
bot.command('create', (ctx) => {
    return ctx.replyWithPhoto(foto), ctx.reply('AGABot: by Ana, Gloria y Alex\nCopyright©-2019')
})

// Comando /WHEREAMI. 
bot.command('whereami', (ctx) => {
    let msg = ctx.message.text.split(/\s(.+)/)[1] // Esto saca todo menos la primera palabra del texto (/wherami)

        let res = request('GET', `https://geocode.xyz/${msg.toLowerCase()}?json=1&auth=779248831305544628193x1897`)

        if(JSON.parse(res.getBody('utf8')).error){
            return ctx.replyWithAnimation('https://media1.tenor.com/images/84e36470c3e534a5e71c208cd872d177/tenor.gif?itemid=6108221'), ctx.reply('Escribe más despacito...')
        }else{
            // return ctx.reply(`Longitud: ${JSON.parse(res.getBody('utf8')).longt}°\n\nLatitud: ${JSON.parse(res.getBody('utf8')).latt}°`)
            let longitud = JSON.parse(res.getBody('utf8')).longt
            let latitud = JSON.parse(res.getBody('utf8')).latt

            return ctx.replyWithPhoto(`https://maps.googleapis.com/maps/api/staticmap?center=${latitud},${longitud}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${latitud},${longitud}&key=AIzaSyDL6bCkarkfr91Sr_kZgdF9WdbjVRzXI0g`)

            
        }

})

// Comando /WEATHER
bot.command('weather', (ctx) => {
    let msg = ctx.message.text.split(/\s(.+)/)[1]
    try{
        let res = request('GET', `http://api.openweathermap.org/data/2.5/weather?q=${msg}&units=metric&APPID=167c7dd8e5dbfe65b6d448c20d4ef0e0`)

        return ctx.reply(`Temperatura actual: ${JSON.parse(res.getBody('utf8')).main.temp} ℃ 🌡\n\nMínimas de unos: ${JSON.parse(res.getBody('utf8')).main.temp_min} ℃ 🌡\n\nMáximas de unos: ${JSON.parse(res.getBody('utf8')).main.temp_max} ℃ 🌡`)
    }catch(err){
        return ctx.replyWithAnimation('https://media1.tenor.com/images/ff7257ce7e22bb5e17eabda8123fb70e/tenor.gif?itemid=11019924'), ctx.reply('Anda anda, revisa bien la ciudad que has escrito...')
    }
    
})

bot.on('text', (ctx) => {
    nlu(ctx.message)
        .then(dialog) // solo dialog, porque es la DEFINICION de la funcion que tenemos en dialog.js, porque then espera una funcion anónima. El .then, pertenece al nlu. El parámetro del then es el mismo que el del resolve
        .then((response) => {
            googleTTS(response, 'es-ES', 3).then((url) => {
                bot.telegram.sendAudio(ctx.from.id, url)
            })
            // bot.telegram.sendMessage(ctx.from.id, response)
        })
})

expressApp.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!')
})
