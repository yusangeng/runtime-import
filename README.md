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

### importModule

Import a module, if the last javascript file is in UMD format, return it's export object.

```js
import { importModule } from 'runtime-import'

try {
  const bootstrap = await importModule({
    js: ['//foobar.com/bootstrap.js'],
    css: ['//foobar.com/bootstrap.css']
  })
} catch (err) {
  console.error(err)
}
```
