const getDriver = require('./browserstack-driver')
const testSuite = require('./test-suite')

const driver = getDriver({
  browserName: 'Safari',
  browser_version: '12.0',
  os: 'OS X',
  os_version: 'Mojave'
})

beforeAll(() => driver.get('http://bs-local.com:8080/test.html'), 5 * 60 * 1000)
afterAll(() => driver.quit(), 5 * 60 * 1000)
describe('test suite', () => {
  testSuite(driver)
})
