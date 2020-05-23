const fs = require('fs-extra')
const path = require('path')

const CACHE_FILE = path.resolve(__dirname, '../../.cache')

module.exports = { get, set }

async function get (key) {
  const cache = await read()
  return cache[key]
}

async function set (key, value) {
  const cache = await read()
  cache[key] = value
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2))
}

async function read () {
  if (await fs.exists(CACHE_FILE)) {
    const raw = await fs.readFile(CACHE_FILE, 'utf8')
    return JSON.parse(raw)
  }
  return {}
}
