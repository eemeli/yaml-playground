/* eslint-env es6, node */
/* eslint-disable no-console */

const { spawn } = require('child_process')
const BrowserStack = require('browserstack-local')
const { dirname, resolve } = require('path')
const Webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const webpackConfig = require('../webpack.config')

for (const cfg of webpackConfig) cfg.mode = 'none'

let browserstack, server, jest
let stopped = false

const startBrowserStackLocal = (args = {}) =>
  new Promise((resolve, reject) => {
    browserstack = new BrowserStack.Local({ force: true })
    browserstack.start(args, error => {
      if (error) {
        if (error.name === 'LocalError') {
          console.info(`Skipping BrowserStack Local start: ${error.message}`)
          resolve()
        } else {
          console.error(error)
          reject()
        }
      } else {
        if (stopped) browserstack.stop(() => {})
        else resolve(browserstack)
      }
    })
  })

const stopBrowserStackLocal = () =>
  new Promise(resolve => {
    if (browserstack && browserstack.isRunning()) browserstack.stop(resolve)
    else resolve()
  })

const startWebpackDevServer = (port = 8080) =>
  new Promise((resolve, reject) => {
    const compiler = Webpack(webpackConfig)
    server = new WebpackDevServer(compiler, { stats: 'errors-warnings' })

    compiler.hooks.done.tap('dev-server', stats => {
      for (const { compilation } of stats.stats) {
        const error = compilation.errors[0]
        if (error) reject()
      }
      if (stopped) server.close()
      else resolve(server)
    })

    server.listen(port, '127.0.0.1')
  })

const stopWebpackDevServer = () =>
  new Promise(resolve => {
    if (server) server.close(resolve)
    else resolve()
  })

function stop() {
  stopped = true
  console.info('\nStopping services...')
  return Promise.all([stopWebpackDevServer(), stopBrowserStackLocal()])
}

async function main() {
  try {
    const jestPkg = require('jest/package.json')
    const jestDir = dirname(require.resolve('jest/package.json'))
    const jestBin = resolve(jestDir, jestPkg.bin.jest)

    await Promise.all([startWebpackDevServer(), startBrowserStackLocal()])
    console.log('')

    await new Promise((resolve, reject) => {
      jest = spawn(jestBin, process.argv.slice(2), {
        stdio: ['pipe', process.stdout, process.stderr]
      })
      jest.on('error', reject)
      jest.on('exit', code => {
        if (code !== 0) reject()
        else resolve()
      })
    })
  } catch (error) {
    if (error) console.error(error)
  }
  await stop()
}

process.on('SIGINT', async () => {
  if (jest) jest.kill('SIGINT')
  else {
    await stop()
    process.exit(1)
  }
})

process.on('SIGTERM', async () => {
  if (jest) jest.kill('SIGTERM')
  else {
    await stop()
    process.exit(1)
  }
})

main()
