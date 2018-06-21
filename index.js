const request = require('request')
const chalk = require('chalk')

const languages = [
  'en',
  'fr'
]

module.exports = function (vorpal) {
  vorpal
    .command('translate <language> <input...>')
    .alias('tr')
    .autocomplete(languages)
    .description('Translate text in another language')
    .action(function (args, callback) {
      const input = args.input.join(' ')
      const language = args.language
      const apikey = vorpal.config.translate.token

      const requestUrl = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apikey}&text=${input}&lang=${language}`
      this.log(requestUrl)

      request
        .get(requestUrl, (error, response, body) => {
          if (error) {
            callback(error)
            return error
          }
          body = JSON.parse(body)

          if (body.code !== 200) {
            const message = chalk.red(body.message)
            callback(message)
            return message
          }

          const result = chalk.green(body.text.join(', '))
          callback(result)
        })
    })
}

/*
{"code":200,"lang":"en-fr","text":["trouver"]}
 */