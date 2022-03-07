/**
 * 加载
 *
 * @author yusangeng@outlook.com
 */

import { installCSS } from './installer/css'
import { installJS } from './installer/js'

/**
 * 组件资源信息.
 *
 * @interface ImportComponentOptions
 */
interface ImportComponentOptions {
  // js文件列表
  js: Array<string>
  // css文件列表
  css: Array<string>
  // 是否以umd格式加载js文件
  umd?: boolean
  crossOrigin?: string
}

/**
 * 加载一个组件.
 *
 * "组件"指的是,包含了js脚本和css样式的文件组合. 如果要导出组件接口, 请将最后一个js构建为UMD格式, 并导出组件接口. 同时将componentOptions.umd设为true
 *
 * @export
 * @param {ImportComponentOptions} componentOptions 组件加载配置信息
 * @returns {Promise<any>}
 */
export async function importComponent(componentOptions: ImportComponentOptions): Promise<any> {
  const { js, css, umd, crossOrigin } = componentOptions

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
  const ret = await importComponent({ js: [url], css: [], ...opt })
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
  const ret = await importComponent({ css: [url], js: [] })
  return ret
}

export default { importComponent, importScript, importStyle }
