/**
 * 加载JS
 *
 * @author yusangeng@outlook.com
 */

import { CacheStatus } from '../cache/cache'
import cache, { JSCacheItem } from '../cache/js'
import addItem from './define'

function compactAlibabaVCOldVersion(url: string): void {
  // patch: vc4.5.8+依赖g_config中的appkey
  const re = /legao-comp\/(.*)\/[\d.]+\/web.js$/
  const match = re.exec(url)
  const win = <any>window

  if (match && match.length > 0) {
    const appKey = match[1]
    win.g_config = win.g_config || {}
    win.g_config.appKey = appKey
  }
}

type InstallAJSOption = {
  umd: boolean
  crossOrigin: string
}

function doInstallAJS(item: JSCacheItem, url: string, options: InstallAJSOption): Promise<any> {
  item.status = CacheStatus.LOADING
  compactAlibabaVCOldVersion(url)

  const { umd, crossOrigin } = options

  return new Promise((resolve, reject) => {
    const el = document.createElement('script')

    el.src = url
    // 保持时序
    el.async = false
    el.crossOrigin = crossOrigin

    if (umd) {
      // 用于define函数发生错误时调用, 详见define.ts
      item.reject = reject

      // 以//开头的地址以及相对地址, 传给el.src后会被补全
      const realURL = el.src
      // 插入加载队列, 详见define.ts
      addItem(realURL, item)
    }

    const loadCallback = () => {
      el.removeEventListener('load', loadCallback)

      item.status = CacheStatus.LOADED
      item.el = null

      resolve(item.exportThing)
    }

    const errorCallback = (evt: ErrorEvent) => {
      el.removeEventListener('error', errorCallback)

      const error = evt.error || new Error(`Load javascript failed. src=${url}`)

      item.status = CacheStatus.ERROR
      item.error = error
      item.el = null

      reject(error)
    }

    el.addEventListener('load', loadCallback)
    el.addEventListener('error', errorCallback)

    item.el = el
    document.body.appendChild(el)
  })
}

function installAJS(url: string, options: InstallAJSOption): Promise<any> {
  const item = cache.getOrCreateItemByURL(url)
  const { status, exportThing, error } = item

  if (status === CacheStatus.LOADED) {
    return Promise.resolve(exportThing)
  }

  if (status === CacheStatus.ERROR) {
    return Promise.reject(error)
  }

  if (status === CacheStatus.LOADING) {
    const { el } = item

    return new Promise((resolve, reject) => {
      const loadCallback = () => {
        el!.removeEventListener('load', loadCallback)
        resolve(item.exportThing)
      }

      const errorCallback = (evt: ErrorEvent) => {
        el!.removeEventListener('error', errorCallback)
        reject(evt.error)
      }

      el!.addEventListener('load', loadCallback)
      el!.addEventListener('error', errorCallback)
    })
  }

  return doInstallAJS(item, url, options)
}

type InstallJSOption = {
  umd?: boolean
  crossOrigin?: string
}

const defaultInstallOptions = {
  umd: true,
  // 避免window.onerror拿不到脚本的报错, 需要服务器支持
  crossOrigin: 'anonymous'
}

export function installJS(urls: Array<string>, options: InstallJSOption): Promise<any> {
  const opt = { ...defaultInstallOptions, ...options }

  let chain = Promise.resolve()
  const lastIndex = urls.length - 1
  const { umd } = opt

  urls.forEach((url, index) => {
    // 只有最后一个js使用umd模式加载
    const useUmd = umd && index === lastIndex
    chain = chain.then(() => installAJS(url, { ...opt, umd: useUmd }))
  })

  return chain
}
