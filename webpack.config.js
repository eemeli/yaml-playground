const { resolve } = require('node:path')

module.exports = {
  entry: './node_modules/yaml/browser/index.js',
  output: {
    path: resolve('./site/dist'),
    filename: 'yaml.browser.js',
    library: 'YAML',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  resolve: {
    fallback: {
      Buffer: false
    }
  }
}
