/**
 * 入口文件
 *
 * @author yusangeng@outlook.com
 */

import importer, { importComponent, importScript, importStyle } from './importer'

/**
 * @deprecated
 */
const importModule = importComponent

export { importComponent, importModule, importScript, importStyle }

export default importer
