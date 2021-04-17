const getDriver = require('./browserstack-driver')
const testSuite = require('./test-suite')

const driver = getDriver({ browserName: 'Chrome', browser_version: '87' })

beforeAll(() => driver.get('http://localhost:8080/test.html'), 5 * 60 * 1000)
afterAll(() => driver.quit(), 5 * 60 * 1000)
describe('test suite', () => {
  testSuite(driver)
})
