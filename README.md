# runtime-import

[![Npm Package](https://badge.fury.io/js/runtime-import.svg)](https://www.npmjs.com/package/runtime-import) [![Downloads](https://img.shields.io/npm/dw/runtime-import.svg?style=flat)](https://www.npmjs.com/package/runtime-import)

Import remote resource(js or css) asynchronously.

> To avoid duplicating runtime-import package, loading a umd bundle file in html is recommended.
>
> The newest umd bundle file is:
>
> ```
> https://unpkg.com/runtime-import@3.0.0-beta.0/dist/runtime-import.umd.js
> ```

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

Import a component. In umd mode, if the entry javascript file is UMD, return it's export object.

Options:

```ts
interface ImportComponentOptions {
  // JavaScript options.
  scripts: {
    // Dependent file URLs.
    dependencies?: string[]
    // UMD entry file URL.
    entry: string
    // Is the entry file a UMD file? The default value is `true`.
    umd?: boolean
    // Value of the `crossOrigin` attribute of the <script> element, the default value is "anonymous".
    crossOrigin?: string
  }
  // Stylesheet options.
  styles?: {
    // CSS URL list.
    urls: string[]
  }
}
```

Note:

- The default value of the `crossOrigin` field in `importComponent`'s options is `true`. This sets the `crossorigin` attribute of the `<script>` elements created by `importComponent` to `"anonymous"`. If you do not want the `crossorigin` attribute to be set, ensure that the `crossOrigin` field in `importComponent`'s options is set to `""`.

Example:

```js
import { importComponent } from 'runtime-import'

try {
  const bootstrap = await importComponent({
    scripts: {
      dependencies: []
      entry: '//foobar.com/bootstrap.js',
    },
    styles{
      urls: ['//foobar.com/bootstrap.css'],
    }
  })
} catch (err) {
  console.error(err)
}
```
