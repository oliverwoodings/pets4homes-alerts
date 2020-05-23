const Sentry = require('@sentry/node')
const config = require('config')

if (config.sentry.enabled) {
  Sentry.init({ dsn: config.sentry.dsn })
}

module.exports = Sentry
