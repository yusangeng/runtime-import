/**
 * Installs javascript files.
 *
 * @author yusangeng@outlook.com
 */

import { cache, CacheItem, CacheStatus } from './javascript-cache'
import addItem from './define-impostor'
import { bindHandlers } from '../utils/bind-handlers'

function patch4AlibabaVCLegacy(url: string): void {
  // legacy: vc4.5.8+依赖g_config中的appkey
  const re = /legao-comp\/(.*)\/[\d.]+\/web.js$/
  const match = re.exec(url)
  const win = window as any

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

function doInstallAJS(item: CacheItem, url: string, options: InstallAJSOption): Promise<any> {
  item.status = CacheStatus.LOADING
  patch4AlibabaVCLegacy(url)

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

    bindHandlers(
      el,
      () => {
        item.status = CacheStatus.LOADED
        item.el = null

        resolve(item.exportThing)
      },
      evt => {
        const error = evt.error || new Error(`Load javascript failed. src=${url}`)

        item.status = CacheStatus.ERROR
        item.error = error
        item.el = null

        reject(error)
      }
    )

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
      bindHandlers(
        el!,
        () => resolve(item.exportThing),
        evt => reject(evt.error)
      )
    })
  }

  return doInstallAJS(item, url, options)
}

type InstallJSOption = {
  umd: boolean
  crossOrigin: string
}

export function installJS(urls: Array<string>, options: InstallJSOption): Promise<any> {
  let chain = Promise.resolve()
  const lastIndex = urls.length - 1
  const { umd } = options

  urls.forEach((url, index) => {
    // 只有最后一个js使用umd模式加载
    const useUmd = umd && index === lastIndex
    chain = chain.then(() => installAJS(url, { ...options, umd: useUmd }))
  })

  return chain
}
