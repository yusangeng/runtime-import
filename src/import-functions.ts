/**
 * Import functions.
 *
 * @author yusangeng@outlook.com
 */

import { installCSS } from './installers/css-installer/css-installer'
import { installJS } from './installers/javascript-installer'

interface ImportComponentOptions {
  // JavaScript options.
  scripts: {
    // Dependent JavaScript URLs.
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

/**
 * Import a remote component and return the export object if the entry is a UMD file.
 *
 * @export
 * @param {ImportComponentOptions} options options
 * @returns {Promise<any>} export.
 */
export async function importComponent(options: ImportComponentOptions): Promise<any> {
  const { scripts, styles } = options

  if (styles) {
    const { urls } = styles
    await installCSS(urls)
  }

  const { dependencies = [], entry, umd = true, crossOrigin = 'anonymous' } = scripts

  // if (!entry) {
  //   throw new Error(`entry should NOT be empty.`)
  // }

  const scriptURLs = entry ? dependencies.concat([entry]) : dependencies

  if (scriptURLs.length) {
    const ret = await installJS(dependencies.concat([entry]), {
      umd,
      crossOrigin
    })

    return ret
  }

  return void 0
}

type ImportScriptOptions = {
  umd?: boolean
  crossOrigin?: string
}

/**
 * Import a remote JavaScript file and return the export object if it's a UMD file.
 *
 * @export
 * @param {string} url script URL
 * @param {ImportScriptOptions | undefined} options options
 * @returns {Promise<any>} export for a UMD file, nothing for a normal file.
 */
export async function importScript(url: string, options?: ImportScriptOptions): Promise<any> {
  const opt = { ...(options ?? {}) }
  const ret = await importComponent({
    scripts: {
      dependencies: [],
      entry: url,
      umd: opt.umd,
      crossOrigin: opt.crossOrigin
    }
  })

  return ret
}

/**
 * Import a remote stylesheet file.
 *
 * @export
 * @param {string} url stylesheet URL
 * @returns {Promise<void>} nothing.
 */
export async function importStyle(url: string): Promise<void> {
  const ret = await importComponent({
    scripts: {
      dependencies: [],
      entry: ''
    },
    styles: { urls: [url] }
  })
  return ret
}

export default { importComponent, importScript, importStyle }
