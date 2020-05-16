module.exports = driver => {
  beforeAll(() =>
    driver.executeScript('return typeof YAML').then(res => {
      expect(res).toBe('object')
    })
  )

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

    test('parse v1.1 document', () => {
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
      return driver
        .executeScript(
          `var res = YAML.parse(${JSON.stringify(src)})
          if (res.date instanceof Date) res.date = res.date.toISOString()
          if (res.set instanceof Set) {
            var set = []
            res.set.forEach(function(value) { set.push(value) })
            res.set = set
          }
          if (res.omap instanceof Map) {
            var omap = []
            res.omap.forEach(function(value, key) { omap.push([key, value]) })
            res.omap = omap
          }
          if (res.picture instanceof Uint8Array) {
            res.pictureLength = res.picture.length
          }
          return res`
        )
        .then(res => {
          expect(res).toMatchObject({
            true: true,
            octal: 12,
            sexagesimal: 12345,
            date: '2002-12-14T00:00:00.000Z',
            omap: [
              ['foo', 'bar'],
              ['fizz', 'buzz']
            ],
            set: ['a', 'b', 'c'],
            pictureLength: 65
          })
        })
    })
  })
}
