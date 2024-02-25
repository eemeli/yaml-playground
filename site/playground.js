console.log('YAML', YAML) // eslint-disable-line no-console

function Store(key) {
  this.get = () => window.localStorage.getItem(key)
  this.remove = () => window.localStorage.removeItem(key)
  this.set = value => window.localStorage.setItem(key, value)
}
const store = new Store('yaml-src')

const defaultSrc = '# Edit YAML here\n\nfoo: 42'
const yamlArea = document.getElementById('yaml')
const jsonArea = document.getElementById('json')

function getJSON(src) {
  const docs = YAML.parseAllDocuments(src)
  const json = docs.map(doc =>
    doc.errors.length > 0
      ? doc.errors
          .slice(0, 5)
          .map(error => `${error.name}:\n  ${error.message}`)
          .join('\n')
      : JSON.stringify(doc.toJSON(), null, '  ')
  )
  return json.join('\n\n')
}

function initValues() {
  let src = defaultSrc
  try {
    const prevSrc = store.get()
    if (prevSrc && typeof prevSrc === 'string') src = prevSrc
  } catch (e) {
    /* ignore error */
  }
  yamlArea.value = src
  yamlArea.setAttribute('placeholder', defaultSrc)
  yamlArea.focus()
  jsonArea.value = getJSON(src)
}

yamlArea.addEventListener('input', () => {
  jsonArea.value = getJSON(yamlArea.value)
})

window.addEventListener('beforeunload', () => {
  try {
    const src = yamlArea.value
    if (src.length <= defaultSrc.length && defaultSrc.indexOf(src) === 0)
      store.remove()
    else store.set(src)
  } catch (e) {
    /* ignore error */
  }
})

initValues()
