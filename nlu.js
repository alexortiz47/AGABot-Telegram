const TelegrafWit = require('telegraf-wit')

const wit = new TelegrafWit('WYTKTPFCDUP7XCWQNTWQ7BRC27MUZA67')

module.exports = (message) => {
    return new Promise((resolve, reject) => {
        wit.meaning(message.text).then(result => { // Esto devuelve una promesa por tanto tenemos que trabajar con then
             message.nlu = result
             resolve(message) // Con esto enviamos el message y podremos capturarlos con el then en donde llamemos a esta promesa
        }) 
    })
}