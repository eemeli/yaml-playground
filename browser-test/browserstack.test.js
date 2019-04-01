const testSuite = require('./test-suite')
const getDriver = require('./browserstack.driver')

for (const browser of [
  'chrome 49',
  'ie 11',
  'edge 17',
  'android 5.0'
  //'safari 12',
  //'ios 11.4'
])
  describe(browser, () => {
    const driver = getDriver(browser)

    beforeAll(
      () => driver.get('http://localhost:8080/test.html'),
      5 * 60 * 1000
    )

    afterAll(() => driver.quit(), 5 * 60 * 1000)

    describe('test suite', () => {
      testSuite(driver)
    })
  })
