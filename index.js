#!/usr/bin/env node

'use strict'
const SS = require('abc-stringify')

class AbcLog {
  constructor(options) {
    options = options || {}
    this.ss = new SS(options)
    this.level = 'off'
    this.out = process.stdout
    this.timePropertyName = 'time'
    this.levelPropertyName = 'level'
    this.logPropertyName = 'log'
    this.delimiter = '\n'
    this.levels = {
      trace: 0,
      debug: 1,
      info: 2,
      warn: 3,
      error: 4,
      fatal: 5,
      off: 6
    }
    this.logLevelFile = null
    this.logLevelPollSeconds = 10
    Object.assign(this, options)
    this.logPropertyName = this.logPropertyName || 'log'
    // probably a good idea to always do but don't want to force it on you.
    // this.ss.includeKeys.push('error', 'stack')
    if (this.timePropertyName) {
      this.ss.includeKeys.push(this.timePropertyName)
    }
    if (this.levelPropertyName) {
      this.ss.includeKeys.push(this.levelPropertyName)
    }
    if (this.logPropertyName) {
      this.ss.includeKeys.push(this.logPropertyName)
    }
    for (const level of Object.keys(this.levels)) {
      this[level] = (o, replacer, space) => {
        if (this.levels[level] >= this.levels[this.level]) {
          let clone = {}
          if (this.timePropertyName) clone[this.timePropertyName] = new Date().toISOString()
          if (this.levelPropertyName) clone[this.levelPropertyName] = level
          clone[this.logPropertyName] = o
          this.out.write(
            `${this.ss.stringify(clone, replacer, space)}${this.delimiter}`)
        }
      }
    }
    if (this.logLevelFile) {
      const fs = require('fs')
      let interval = 10000
      if (!isNaN(parseInt(this.logLevelPollSeconds, 10))) {
        interval = parseInt(this.logLevelPollSeconds, 10) * 1000
      }
      const readLogLevelFile = () => {
        fs.readFile(this.logLevelFile, 'utf8', (err, data) => {
          if (!err) {
            this.level = data.trim()
          }
        })
      }
      fs.watchFile(this.logLevelFile, {
        persistent: false,
        interval
      }, readLogLevelFile)
    }
  }
}
exports = module.exports = AbcLog
if (require.main === module) {
  const log = new AbcLog({
    level: 'info',
    includeKeys: ['error', 'message', 'stack'],
    logPropertyName: '',
    replacerArrayExcludes: true,
    replaceValues: ['PA']
    // timePropertyName: undefined,
    // levelPropertyName: undefined
  })
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
          stuff: [{peanut: 'butter'}, 2, 'three']
        }
      }
    }
  }
  o.circular = o
  log.info(o, ['peanut'], 3)
  // const fs = require('fs')
  // const log = new AbcLog({
  //   // out: fs.createWriteStream('junk.txt'),
  //   // logPropertyName: 'my_object',
  //   level: 'debug',
  //   logLevelFile: 'loglevel',
  //   replacerArrayExcludes: true,
  //   replaceValues: ['1234 lane st', 'three'],
  //   replacedValue: '***REDACTED***',
  //   replacer: (key, value) => value
  // })

  // log.debug(o, ['trip', 'st'], 3)

  // setInterval(() => {
  //   log.debug(o, ['trip', 'st'], 3)
  // }, 3000)
}
