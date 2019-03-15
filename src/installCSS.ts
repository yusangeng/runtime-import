/**
 * 加载CSS
 * 
 * @author Y3G
 */

import cache, { CacheStatus } from './cache'

function installACSS (url: string) : Promise<void> {
  const item = cache.item(url)
  const { status, error } = item

  if (status === CacheStatus.LOADED) {
    return Promise.resolve()
  }

  if (status === CacheStatus.ERROR) {
    return Promise.reject(error)
  }

  if (status === CacheStatus.LOADING) {
    return new Promise((resolve, reject) => {
      const { el } = item
      const loadCallback = () => {
        el!.removeEventListener('load', loadCallback)
        resolve()
      }
      const errorCallback = (evt: ErrorEvent) => {
        el!.removeEventListener('error', errorCallback)
        reject(evt.error)
      }

      el!.addEventListener('load', loadCallback)
      el!.addEventListener('error', errorCallback)
    })
  }

  item.status = CacheStatus.LOADING

  return new Promise((resolve, reject) => {
    const el = document.createElement('link')

    el.rel = 'stylesheet'
    el.href = url

    const loadCallback = () => {
      el.removeEventListener('load', loadCallback)
      
      item.status = CacheStatus.LOADED
      item.el = null
      resolve()
    }

    const errorCallback = (evt: ErrorEvent) => {
      el!.removeEventListener('error', errorCallback)

      const error = evt.error || new Error(`Load css failed. href=${url}`)

      item.status = CacheStatus.ERROR
      item.error = error
      item.el = null
      
      reject(error)
    }

    el.addEventListener('load', loadCallback)
    el.addEventListener('error', errorCallback)

    item.el = el
    document.head.appendChild(el)
  })
}

export default function installCSS (urls: Array<string>) : Promise<void> {
  return Promise.all(urls.map(url => installACSS(url))).then(() => {
    return Promise.resolve()
  }).catch (err => {
    return Promise.reject(err)
  })
}
