const { Builder, Capabilities } = require('selenium-webdriver')

describe('Browser tests', () => {
  let driver

  beforeAll(
    async () => {
      driver = new Builder()
        .usingServer(`http://localhost:4444/wd/hub`)
        .withCapabilities(Capabilities.chrome())
        .build()

      await driver.get('http://bs-local.com:8080/test.html')
    },
    5 * 60 * 1000
  )

  afterAll(async () => {
    await driver.quit()
  })

  test('typeof YAML', async () => {
    const res = await driver.executeScript('return typeof YAML')
    expect(res).toBe('object')
  })

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

  describe('parse features', () => {
    test('parse anchor', async () => {
      const res = await driver.executeScript(
        `return YAML.parse('- &A aa\\n- bb\\n- *A')`
      )
      expect(res).toMatchObject(['aa', 'bb', 'aa'])
    })

    test('parse multiple documents', async () => {
      const res = await driver.executeScript(
        `var src = 'first\\n---\\n2nd\\n...\\n3\\n'
        var docs = YAML.parseAllDocuments(src)
        return docs.map(function(doc) { return doc.toJSON() })`
      )
      expect(res).toMatchObject(['first', '2nd', 3])
    })

    test('parse v1.1 document', async () => {
      const src = `%YAML 1.1\n---
        true: Yes
        octal: 014
        sexagesimal: 3:25:45
        date: 2002-12-14
        omap: !!omap
          - foo: bar
          - fizz: buzz
        set: !!set { a, b, c }
        picture: !!binary |
          R0lGODlhDAAMAIQAAP//9/X
          17unp5WZmZgAAAOfn515eXv
          Pz7Y6OjuDg4J+fn5OTk6enp
          56enmleECcgggoBADs=
        `
      const res = await driver.executeScript(
        `var res = YAML.parse(${JSON.stringify(src)})
        try {
          res.date = 'date:' + res.date.toISOString()
        } catch (error) {
          res.date = error
        }
        try {
          var set = []
          res.set.forEach((value) => set.push(value))
          res.set = set
        } catch (error) {
          res.set = error
        }
        try {
          var omap = []
          res.omap.forEach((value, key) => omap.push([key, value]))
          res.omap = omap
        } catch (error) {
          res.omap = error
        }
        try {
          res.pictureLength = res.picture.length
        } catch (error) {
          res.pictureLength = error
        }
        return res`
      )
      expect(res).toMatchObject({
        true: true,
        octal: 12,
        sexagesimal: 12345,
        date: 'date:2002-12-14T00:00:00.000Z',
        omap: [
          ['foo', 'bar'],
          ['fizz', 'buzz']
        ],
        set: ['a', 'b', 'c'],
        pictureLength: 65
      })
    })

    test('parse with reviver', async () => {
      const res = await driver.executeScript(
        `return YAML.parse(
          '{"1": 1, "2": 2, "3": {"4": 4, "5": {"6": 6}}}',
          function(key, value) { return typeof value === 'number' ? 2 * value : value }
        )`
      )
      expect(res).toMatchObject({ 1: 2, 2: 4, 3: { 4: 8, 5: { 6: 12 } } })
    })
  })

  describe('stringify features', () => {
    test('stringify with replacer', async () => {
      const res = await driver.executeScript(
        `return YAML.stringify(
          { a: 1, b: 2, c: [3, 4] },
          function(key, value) { return typeof value === 'number' ? 2 * value : value }
        )`
      )
      expect(res).toBe('a: 2\nb: 4\nc:\n  - 6\n  - 8\n')
    })
  })
})
