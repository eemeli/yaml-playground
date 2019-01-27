import YAML from 'yaml'
import './main.css'

console.log('YAML', YAML)

const yamlArea = document.getElementById('yaml')
const jsonArea = document.getElementById('json')

let src = ''
yamlArea.addEventListener('input', () => {
  if (yamlArea.value === src) return
  src = yamlArea.value
  const docs = YAML.parseAllDocuments(src)
  const json = docs.map(doc =>
    doc.errors.length > 0
      ? doc.errors
          .slice(0, 5)
          .map(error => {
            const pos = error.source.rangeAsLinePos
            let head = error.name
            if (pos && pos.start)
              head += ` at line ${pos.start.line}, column ${pos.start.col}`
            return `${head}:\n  ${error.message}`
          })
          .join('\n')
      : JSON.stringify(doc.toJSON(), null, '  ')
  )
  jsonArea.value = json.join('\n\n')
})
