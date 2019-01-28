/**
 * 加载
 *
 * @author Y3G
 */

import installCSS from './installCSS'
import installJS from './installJS'

/**
 * 模块资源信息.
 *
 * @interface ModuleInfo
 */
interface ModuleInfo {
  js: Array<string>,
  css: Array<string>
}

/**
 * 加载一个完整模块.
 * 
 * module中最后一个js会以模拟的AMD格式加载, 如果要导出接口, 最后一个js请使用UMD格式.
 *
 * @export
 * @param {ModuleInfo} module 模块信息
 * @returns {Promise<any>}
 */
export async function importModule (module: ModuleInfo) : Promise<any> {
  const { js, css } = module

  await installCSS(css)
  const ret = await installJS(js)

  return ret
}

type ImportScriptOptions = {
  umd: boolean
}

/**
 * 加载一个js脚本.
 *
 * @export
 * @param {string} url 脚本地址
 * @param {ImportScriptOptions} [options={ umd: true }] 配置项
 * @returns {Promise<any>}
 */
export async function importScript (url: string, options: ImportScriptOptions = { umd: true }) : Promise<any> {
  const ret = await importModule({ js: [url], css: [] })
  return ret
}

/**
 * 加载一个css文件.
 *
 * @export
 * @param {string} url css地址
 * @returns {Promise<any>}
 */
export async function importStyle (url: string) : Promise<void> {
  const ret = await importModule({ css: [url], js: [] })
  return ret
}

export default { importModule, importScript, importStyle }