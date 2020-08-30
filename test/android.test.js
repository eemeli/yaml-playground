const getDriver = require('./browserstack-driver')
const testSuite = require('./test-suite')

const driver = getDriver({
  browserName: 'android',
  device: 'Google Nexus 6',
  realMobile: 'true',
  os_version: '6.0'
})

beforeAll(() => driver.get('http://localhost:8080/test.html'), 5 * 60 * 1000)
afterAll(() => driver.quit(), 5 * 60 * 1000)
describe('test suite', () => {
  testSuite(driver)
})
