const path = require('path')
const chrome = require('selenium-webdriver/chrome')
const { Builder } = require('selenium-webdriver')

const testSuite = require('./test-suite')

const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options().headless())
  .build()

beforeAll(() => {
  const dist = path.resolve(__dirname, '../dist')
  return driver.get(`file://${dist}/test.html`)
}, 10000)

afterAll(() => driver.quit(), 10000)

describe('test suite', () => {
  testSuite(driver)
})
