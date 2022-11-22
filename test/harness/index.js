/* eslint-env mocha */
'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai')
const fsp = require('node:fs/promises')

chai.use(require('chai-fs'))
chai.use(require('chai-spies'))
// dirty-chai must be loaded after the other plugins
// see https://github.com/prodatakey/dirty-chai#plugin-assertions
chai.use(require('dirty-chai'))

const cleanDir = (dir, { create } = {}) =>
  fsp.rm(dir, { recursive: true, force: true }).then(() => (create ? fsp.mkdir(dir, { recursive: true }) : undefined))

const heredoc = (literals) => {
  const str = literals[0].trimEnd()
  let lines = str.split(/^/m)
  if (lines[0] === '\n') lines = lines.slice(1)
  if (lines.length < 2) return str // discourage use of heredoc in this case
  const last = lines.pop()
  if (last != null) {
    lines.push(last[last.length - 1] === '\\' && last[last.length - 2] === ' ' ? last.slice(0, -2) + '\n' : last)
  }
  const indentRx = /^ +/
  const indentSize = Math.min(...lines.filter((l) => l.charAt() === ' ').map((l) => l.match(indentRx)[0].length))
  return (indentSize ? lines.map((l) => (l.charAt() === ' ' ? l.slice(indentSize) : l)) : lines).join('')
}

module.exports = { cleanDir, expect: chai.expect, heredoc, spy: chai.spy }
