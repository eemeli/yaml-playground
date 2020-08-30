const { Builder } = require('selenium-webdriver')

const bsConfig = {
  project: 'yaml-playground',
  'browserstack.local': 'true',
  'browserstack.user':
    process.env.BROWSERSTACK_USER || process.env.BROWSERSTACK_USERNAME,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER
}

module.exports = browser =>
  new Builder()
    .usingServer('http://hub-cloud.browserstack.com/wd/hub')
    .withCapabilities(Object.assign({}, browser, bsConfig))
    .build()
