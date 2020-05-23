const axios = require('axios')
const cheerio = require('cheerio')
const log = require('./lib/log')
const cache = require('./lib/cache')
const twilio = require('./lib/twilio')

module.exports = async function checkForDoggos (check) {
  log.info('Opening up doggo page')
  const { data } = await axios.get(check.url)

  const $ = cheerio.load(data)
  const listings = $('.profilelisting[itemtype="http://schema.org/Product"]')
    .map((i, item) => ({
      title: $(item)
        .find('.headline a')
        .text()
        .trim(),
      location: $(item)
        .find('.location')
        .text()
        .trim()
        .replace(/\n/g, ' '),
      link: $(item)
        .find('.headline a')
        .attr('href'),
      price: $(item)
        .find('.listingprice')
        .text()
        .trim(),
      updated: $(item)
        .find('.profile-listing-updated')
        .text()
        .trim()
    }))
    .get()

  for (const listing of listings) {
    const { link, title, location, price, updated } = listing
    const inCache = await cache.get(link)
    if (inCache) {
      log.info(`Skipping ${link}, already in cache`)
      continue
    }

    const message = `There are puppies available in ${location} for ${price}! ${title} - ${link} - ${updated}`
    log.info(message)
    await twilio.send(check.phoneNumber, message)
    await cache.set(link, true)
  }
}
