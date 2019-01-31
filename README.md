# Browser Playground for `yaml`

This repository fulfills multiple related needs:

1. Packages the browser build of `yaml` into a minified UMD package `yaml.browser.js`.
2. Packages the minimal polyfills required by `yaml` into `polyfill.js`.
3. Tests the library in browser environments (provided by [BrowserStack](http://browserstack.com/))
4. Provides an interactive playground for testing and playing with YAML

This repo is meant to be used as a submodule of [`eemeli/yaml`](https://github.com/eemeli/yaml), hence the `"yaml": "file:.."` dependency in package.json. To use independently, run `npm install yaml@latest`.
