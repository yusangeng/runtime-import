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
      el!.addEventListener('load', () => {
        resolve()
      })

      el!.addEventListener('error', evt => {
        reject(evt.error)
      })
    })
  }

  item.status = CacheStatus.LOADING

  return new Promise((resolve, reject) => {
    const el = document.createElement('link')

    el.rel = 'stylesheet'
    el.href = url

    el.addEventListener('load', () => {
      item.status = CacheStatus.LOADED
      resolve()
    })

    el.addEventListener('error', evt => {
      const error = evt.error || new Error(`Load css failed. href=${url}`)

      item.status = CacheStatus.ERROR
      item.error = error
      reject(error)
    })

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
