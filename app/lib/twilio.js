const createTwilio = require('twilio')
const config = require('config')
const log = require('./log')('twilio')

const twilio = createTwilio(config.twilio.accountSid, config.twilio.authToken)

module.exports = { send }

async function send (to, body) {
  log.info(`Texting ${to}: ${body}`)
  await twilio.messages.create({
    body,
    from: config.twilio.from,
    to
  })
}
