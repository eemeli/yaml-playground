const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
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
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'test.html',
        title: 'YAML Browser Tests'
      })
    ]
  },
  common
)

const app = Object.assign(
  {
    entry: './src/index.js',
    externals: { yaml: 'YAML' },
    plugins: [
      new HtmlWebpackPlugin({ template: 'src/index.html' }),
      new MiniCssExtractPlugin({ filename: '[name].css' })
    ]
  },
  common
)

module.exports = [yaml, app]
