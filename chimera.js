const toxy = require('/node_modules/toxy')

// See rocky config https://github.com/h2non/rocky#configuration
const proxy = toxy({ target: 'http://127.0.0.1:8888', timeout: 30000 })
const rules = proxy.rules
const poisons = proxy.poisons

proxy
  .poison(poisons.bandwidth({ bps: 10240 }))
  .withRule(rules.probability(60))

proxy
  .poison(toxy.poisons.latency({ max: 1000, min: 100 }))
  .withRule(rules.probability(30))

proxy
  .poison(toxy.poisons.inject({
          code: 503,
          body: '{"error": "toxy injected error"}',
          headers: {'Content-Type': 'application/json'}
        }))
  .withRule(rules.probability(8))


proxy.all('/*')

proxy.listen(3000)
console.log('Server listening on port:', 3000)

const opts = { apiKey: 'CH405' }
var admin = toxy.admin(opts)

admin.listen(9000)
console.log('protected toxy admin server listening on port:', 9000)
