/**
 * Entry file.
 *
 * @author yusangeng@outlook.com
 */

import importFunctions, { importComponent, importScript, importStyle } from './import-functions'

const importModule = importComponent

export {
  importComponent,
  importScript,
  importStyle,
  /** @deprecated */
  importModule
}

export default importFunctions
