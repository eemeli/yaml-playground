const HtmlWebpackPlugin = require('html-webpack-plugin')

const common = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}

const yaml = Object.assign(
  {
    entry: './node_modules/yaml/browser/dist/index.js',
    output: {
      filename: 'yaml.browser.js',
      library: 'YAML',
      libraryTarget: 'umd'
    }
  },
  common
)

const app = Object.assign(
  {
    entry: './src/index.js',
    externals: { yaml: 'YAML' },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      })
    ]
  },
  common
)

module.exports = [yaml, app]
