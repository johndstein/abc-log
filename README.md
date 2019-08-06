# abc-log

Configurable [JSON.stringify()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
logging to any output stream.

* Configurable stringify
    (see [abc-stringify](https://www.npmjs.com/package/abc-stringify))
* Configurable output stream
* Configurable levels
* Configurable `time`, `level`, and `log` property names
* Configurable watch file to change log level

## Quick Start

```js
const AbcLog = require('abc-log')
const log = new AbcLog({ level: 'info' })
const o = {
  error: new Error('something bad happened'),
  name: 'freddy',
  address: {
    street: '1234 lane st',
    city: 'hereshey',
    st: 'PA',
    zip: '19293'
  },
  nest: {
    really: {
      deep: {
        stuff: ['one', 2, 'three']
      }
    }
  }
}
o.circular = o
// Signature is compatible with JSON.stringify(value, replacer, space)
log.info(o, 2) // same as log.info(o, null, 2)
```

Results

```json
{
  "time": "2019-08-05T18:13:25.785Z",
  "level": "info",
  "log": {
    "error": {
      "name": "Error",
      "message": "something bad happened",
      "stack": "Error: something bad happened\n    at Object.<anonymous> (/Users/jds/jds/abc-log/index.js:70:12)\n    at Module._compile (internal/modules/cjs/loader.js:776:30)\n    at Object.Module._extensions..js (internal/modules/cjs/loader.js:787:10)\n    at Module.load (internal/modules/cjs/loader.js:653:32)\n    at tryModuleLoad (internal/modules/cjs/loader.js:593:12)\n    at Function.Module._load (internal/modules/cjs/loader.js:585:3)\n    at Function.Module.runMain (internal/modules/cjs/loader.js:829:12)\n    at startup (internal/bootstrap/node.js:283:19)\n    at bootstrapNodeJSCore (internal/bootstrap/node.js:622:3)"
    },
    "name": "freddy",
    "address": {
      "street": "1234 lane st",
      "city": "hereshey",
      "st": "PA",
      "zip": "19293"
    },
    "nest": {
      "really": {
        "deep": {
          "stuff": [
            "one",
            2,
            "three"
          ]
        }
      }
    },
    "circular": "--circular--"
  }
}
```
