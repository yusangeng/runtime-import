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
    
    if (umd) {
      // 用于define函数发生错误时调用, 详见define.ts
      item.reject = reject
      // 插入加载队列, 详见define.ts
      pushItem(item)
    }

    el.addEventListener('load', () => {
      item.status = CacheStatus.LOADED
      resolve(item.exportThing)
    })

    el.addEventListener('error', evt => {
      const error = evt.error || new Error(`Load javascript failed. src=${url}`)

      item.status = CacheStatus.ERROR
      item.error = error
      reject(error)
    })

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
      el!.addEventListener('load', () => {
        resolve(item.exportThing)
      })

      el!.addEventListener('error', evt => {
        reject(evt.error)
      })
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
