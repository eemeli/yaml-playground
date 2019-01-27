const { Builder } = require('selenium-webdriver')

const bsConfig = {
  project: 'yaml-playground',
  'browserstack.local': 'true',
  'browserstack.user': process.env.BROWSERSTACK_USER,
  'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
  'browserstack.localIdentifier': process.env.BROWSERSTACK_LOCAL_IDENTIFIER
}

const browsers = {
  'chrome 49': {
    browserName: 'Chrome',
    browser_version: '49.0',
    os: 'Windows',
    os_version: '10'
  },
  'ie 11': {
    browserName: 'IE',
    browser_version: '11.0',
    os: 'Windows',
    os_version: '8.1'
  },
  'edge 17': {
    browserName: 'Edge',
    browser_version: '17.0',
    os: 'Windows',
    os_version: '10'
  },
  'safari 12': {
    browserName: 'Safari',
    browser_version: '12.0',
    os: 'OS X',
    os_version: 'Mojave'
  },
  'android 5.0': {
    browserName: 'android',
    device: 'Samsung Galaxy S6',
    realMobile: 'true',
    os_version: '5.0'
  },
  'ios 11.4': {
    browserName: 'iPhone',
    device: 'iPhone 6S',
    realMobile: 'true',
    os_version: '11.4'
  }
}

module.exports = function getDriver(id) {
  const browser = browsers[id]
  if (!browser) throw new Error(`Unknown browser id ${JSON.stringify(id)}`)
  return new Builder()
    .usingServer('http://hub-cloud.browserstack.com/wd/hub')
    .withCapabilities(Object.assign({}, browser, bsConfig))
    .build()
}
