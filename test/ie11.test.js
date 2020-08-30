const getDriver = require('./browserstack-driver')
const testSuite = require('./test-suite')

const driver = getDriver({
  browserName: 'IE',
  browser_version: '11.0',
  os: 'Windows',
  os_version: '8.1'
})

beforeAll(() => driver.get('http://localhost:8080/test.html'), 5 * 60 * 1000)
afterAll(() => driver.quit(), 5 * 60 * 1000)
describe('test suite', () => {
  testSuite(driver)
})
