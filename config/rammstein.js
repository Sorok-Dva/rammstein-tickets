const puppeteerOpts = require('./puppeteer').options
const puppeteer = require('puppeteer')
const discord = require('./discord')

const rammstein = {
  browser: null,
  page: null,
  url: 'https://exchange.stadefrance.com/content',
  close: async () => {
    if (!rammstein.browser) return true
    await rammstein.browser.close().then(async () => {
      rammstein.browser = null
      console.log(`Scrap finished for ${rammstein.url}`)
    })
  },
  init: async () => {
    try {
      rammstein.browser = await puppeteer.launch(puppeteerOpts)
      rammstein.page = await rammstein.browser.newPage()
      await rammstein.page.setViewport({width: 1900, height: 1000, deviceScaleFactor: 1})

      await rammstein.page.goto(rammstein.url, {waitUntil: 'networkidle2'})

      const title = await rammstein.page.title()
      console.log(title)

      if (title === 'Waiting Room') {
        setTimeout(async () => {
          await rammstein.page.goto(rammstein.url, {waitUntil: 'networkidle2'})
        }, 5000)
      }
      await rammstein.page.waitForFunction(
        'document.querySelector("body").innerText.includes("RAMMSTEIN")'
      )
      await rammstein.checkTicket()
    } catch (e) {
      console.error('[INIT] Failed', e)
    } finally {
      await rammstein.close()
    }
  },
  checkTicket: async () => {
    try {
      const ticketSoldOut = await rammstein.page.evaluate(() => document.getElementsByClassName('stx-ProductCardIndicator-10228695701365').length === 1)

      if (!ticketSoldOut) await discord(`<@141895511643914240> TICKET RAMMSTEIN DISPONIBLE`)
    } catch (e) {
      console.error('[checkTicket] Error', e)
      await rammstein.close()
    }
  },
}

module.exports = rammstein
