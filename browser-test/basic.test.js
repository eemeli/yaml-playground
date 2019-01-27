const path = require('path')
const chrome = require('selenium-webdriver/chrome')
const { Builder } = require('selenium-webdriver')

let driver
beforeAll(() => {
  driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless())
    .build()
  return driver.get('file://' + path.join(__dirname, '../dist/test.html'))
})

afterAll(() => driver.quit())

const valid = [
  { name: 'plain string', yaml: 'foo\n', js: 'foo' },
  { name: 'plain number', yaml: '42\n', js: 42 },
  { name: 'block map', yaml: 'foo: bar\n', js: { foo: 'bar' } },
  { name: 'block seq', yaml: '- foo\n- bar\n', js: ['foo', 'bar'] }
]

for (const { name, yaml, js } of valid) {
  describe(name, () => {
    test('parse', () =>
      driver
        .executeScript(`return YAML.parse(${JSON.stringify(yaml)})`)
        .then(res => {
          if (typeof js === 'object') expect(res).toMatchObject(js)
          else expect(res).toBe(js)
        }))
    test('stringify', () =>
      driver
        .executeScript(`return YAML.stringify(${JSON.stringify(js)})`)
        .then(res => {
          expect(res).toBe(yaml)
        }))
  })
}

describe('parse advanced features', () => {
  test('parse anchor', () =>
    driver
      .executeScript(`return YAML.parse('- &A aa\\n- bb\\n- *A')`)
      .then(res => {
        expect(res).toMatchObject(['aa', 'bb', 'aa'])
      }))

  test('parse multiple documents', () =>
    driver
      .executeScript(
        `var src = 'first\\n---\\n2nd\\n...\\n3\\n'
        var docs = YAML.parseAllDocuments(src)
        return docs.map(function(doc) { return doc.toJSON() })`
      )
      .then(res => {
        expect(res).toMatchObject(['first', '2nd', 3])
      }))

  test('parse v1.1 document', () =>
    driver
      .executeScript(
        `return YAML.parse('%YAML 1.1\\n---\\ny: ~\\n010: eight\\n')`
      )
      .then(res => {
        expect(res).toMatchObject({ true: null, 8: 'eight' })
      }))
})
