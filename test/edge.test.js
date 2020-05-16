const getDriver = require('./driver')
const testSuite = require('./test-suite')

const browser = 'edge 17'
const driver = getDriver(browser)
beforeAll(() => driver.get('http://localhost:8080/test.html'), 5 * 60 * 1000)
afterAll(() => driver.quit(), 5 * 60 * 1000)
describe('test suite', () => {
  testSuite(driver)
})
