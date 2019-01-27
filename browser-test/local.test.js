const chrome = require('selenium-webdriver/chrome')
const { Builder } = require('selenium-webdriver')

const testSuite = require('./test-suite')

const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(new chrome.Options().headless())
  .build()

beforeAll(() => driver.get('http://localhost:8080/test.html'), 10000)

afterAll(() => driver.quit(), 10000)

describe('test suite', () => {
  testSuite(driver)
})
