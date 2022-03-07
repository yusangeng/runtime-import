# runtime-import

[![TypeScript](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.tslang.cn/) [![Build Status](https://github.com/yusangeng/runtime-import/workflows/test/badge.svg)](https://github.com/yusangeng/runtime-import/actions?query=workflow%3Atest) [![Npm Package](https://badge.fury.io/js/runtime-import.svg)](https://www.npmjs.com/package/runtime-import) [![Downloads](https://img.shields.io/npm/dw/runtime-import.svg?style=flat)](https://www.npmjs.com/package/runtime-import)

Import remote resource(js or css) asynchronously.

## Install

```shell
npm i runtime-import --save
```

## Usage

### importScript

Import a javascript file, if the file is in UMD format, return it's export object.

```js
import { importScript } from 'runtime-import'

try {
  const $ = await importScript('//foobar.com/jquery.js')
} catch (err) {
  console.error(err)
}
```

### importStyle

Import a css file.

```js
import { importStyle } from 'runtime-import'

try {
  await importStyle('//foobar.com/bootstrap.css')
} catch (err) {
  console.error(err)
}
```

### importComponent

Import a component. In umd mode, if the last javascript file is in UMD format, return it's export object.

Options:

- js: List of js files.
- css: List of css files.
- crossOrigin: value of attribute `crossorigin` of script tags created internally.
- umd: Whether UMD mode is enabled.

Note:

- The default value of the field `crossOrigin` of importComponent's options is `true`. It sets the attribute `crossorigin` of `<script>` elements created by importComponent to `"anonymous"`. If you don't want the attribute `"crossorigin"` to be setted, please make sure that the field `crossOrigin` of importComponent's options setted to `""`.

```js
import { importComponent } from 'runtime-import'

try {
  const bootstrap = await importComponent({
    js: ['//foobar.com/bootstrap.js'],
    css: ['//foobar.com/bootstrap.css'],
    crossOrigin: '',
    umd: true
  })
} catch (err) {
  console.error(err)
}
```

### importModule

`importComponent` use to be called `importModule`, legacy projects could use `importModule` as usual.
