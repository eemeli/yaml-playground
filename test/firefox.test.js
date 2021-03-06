const getDriver = require('./browserstack-driver')
const testSuite = require('./test-suite')

const driver = getDriver({ browserName: 'Firefox', browser_version: '78' })

beforeAll(() => driver.get('http://localhost:8080/test.html'), 5 * 60 * 1000)
afterAll(() => driver.quit(), 5 * 60 * 1000)
describe('test suite', () => {
  testSuite(driver)
})
