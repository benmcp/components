/* eslint-disable-next-line */
'use strict'

const fs = require('fs')
const path = require('path')
const join = require('path').join
const cp = require('child_process')
const os = require('os')

// get registry path
const registry = path.resolve(__dirname, path.join('..', 'registry'))

fs.readdirSync(registry).forEach((mod) => {
  // NOTE: returning early since we don't need this on CI systems
  if (process.env.CI) return

  const modPath = join(registry, mod)
  // ensure path has package.json
  if (!fs.existsSync(join(modPath, 'package.json'))) return

  // npm binary based on OS
  const npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm'

  // install folder
  const install = cp.spawn(npmCmd, [ 'i' ], { env: process.env, cwd: modPath })
  install.stdout.on('data', (data) => {
    console.log(data.toString()) // eslint-disable-line no-console
  })
})
