const driftwood = require('driftwood')

driftwood.enable({ '*': 'debug' })

module.exports = driftwood('pets4homes-alerts')
