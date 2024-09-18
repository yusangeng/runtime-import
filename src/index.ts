/**
 * Entry file.
 *
 * @author yusangeng@outlook.com
 */

import { importComponent, importScript, importStyle } from './import-functions'

const importModule = importComponent

export {
  importComponent,
  importScript,
  importStyle,
  /** @deprecated */
  importModule
}
