/**
 * 加载
 *
 * @author Y3G
 */

import { installCSS } from './installer/css'
import { installJS } from './installer/js'

/**
 * 模块资源信息.
 *
 * @interface ModuleInfo
 */
interface ModuleInfo {
  js: Array<string>
  css: Array<string>
  umd?: boolean
  crossOrigin?: string
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
export async function importModule(module: ModuleInfo): Promise<any> {
  const { js, css, umd, crossOrigin } = module

  await installCSS(css)
  const ret = await installJS(js, {
    umd: typeof umd === 'undefined' ? true : umd,
    crossOrigin: typeof crossOrigin === 'undefined' ? 'anonymous' : crossOrigin
  })

  return ret
}

type ImportScriptOptions = {
  umd?: boolean
  crossOrigin?: string
}

const defaultImportScriptOptions = {
  umd: true,
  crossOrigin: 'anonymous'
}

/**
 * 加载一个js脚本.
 *
 * @export
 * @param {string} url 脚本地址
 * @param {ImportScriptOptions} [options={ umd: true }] 配置项
 * @returns {Promise<any>}
 */
export async function importScript(
  url: string,
  options: ImportScriptOptions = defaultImportScriptOptions
): Promise<any> {
  const opt = { ...defaultImportScriptOptions, ...options }
  const ret = await importModule({ js: [url], css: [], ...opt })
  return ret
}

/**
 * 加载一个css文件.
 *
 * @export
 * @param {string} url css地址
 * @returns {Promise<any>}
 */
export async function importStyle(url: string): Promise<void> {
  const ret = await importModule({ css: [url], js: [] })
  return ret
}

export default { importModule, importScript, importStyle }
