require('dotenv').config()
const CronJob = require('cron').CronJob

const rammstein = require('./config/rammstein')

const Rammstein_job = new CronJob(process.env.RAMMSTEIN_CRONJOB, async () => {
  if (rammstein.browser) await rammstein.close()
  await rammstein.init()
})

Rammstein_job.start()
