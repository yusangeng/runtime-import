/**
 * 加载JS
 * 
 * @author Y3G
 */

import cache, { CacheStatus, CacheItem } from './cache'
import pushItem from './define'

function doPrivateJob (url: string) : void {
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

function doInstallAJS(item: CacheItem, url: string, umd: boolean) : Promise<any> {
  item.status = CacheStatus.LOADING
  doPrivateJob(url)

  return new Promise((resolve, reject) => {
    const el = document.createElement('script')

    el.src = url
    el.async = false // 保持时序
    el.crossOrigin = 'anonymous' // 避免window.onerror拿不到脚本的报错
    
    if (umd) {
      // 用于define函数发生错误时调用, 详见define.ts
      item.reject = reject
      // 插入加载队列, 详见define.ts
      pushItem(item)
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

function installAJS (url: string, umd: boolean) : Promise<any> {
  const item = cache.item(url)
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

  return doInstallAJS(item, url, umd)
}

type InstallJSOption = {
  umd: boolean
}

export default function installJS (urls: Array<string>, options: InstallJSOption = { umd: true }) : Promise<any> {
  let chain = Promise.resolve()
  const lastIndex = urls.length - 1
  const { umd } = options

  urls.forEach((url, index) => {
    // 只有最后一个js使用umd模式加载
    const useUmd = umd && (index === lastIndex)
    chain = chain.then(_ => installAJS(url, useUmd))
  })

  return chain
}
