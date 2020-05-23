const config = require('config')
const { CronJob } = require('cron')
const log = require('./lib/log')
const sentry = require('./lib/sentry')
const checkForDoggos = require('./checkForDoggos')

log.info(`Running on schedule: ${config.schedule}`)
new CronJob(config.schedule, runAll, null, true, null, null, config.runOnStart)

async function runAll () {
  for (const check of config.checks) {
    try {
      log.info(`Checking for doggos at ${check.url}`)
      await checkForDoggos(check)
    } catch (e) {
      log.error(e)
      sentry.captureException(e)
    }
  }
}
