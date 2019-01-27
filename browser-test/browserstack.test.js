const testSuite = require('./test-suite')
const getDriver = require('./browserstack.driver')

for (const browser of [
  'chrome 49',
  //'ie 11',
  'edge 17',
  'safari 12',
  'android 5.0'
  //'ios 11.4'
])
  describe(browser, () => {
    const driver = getDriver(browser)

    beforeAll(() => driver.get('http://localhost:8080/test.html'), 30000)

    afterAll(() => driver.quit(), 30000)

    describe('test suite', () => {
      testSuite(driver)
    })
  })
