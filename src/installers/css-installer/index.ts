/**
 * Installs and uninstalls CSS files.
 *
 * @author yusangeng@outlook.com
 */

import { cache, CacheStatus } from './css-cache'
import { bindHandlers } from '../utils/bind-handlers'

function installACSS(url: string): Promise<void> {
  const item = cache.getOrCreateItemByURL(url)
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

      bindHandlers(
        el!,
        () => resolve(),
        evt => reject(evt.error)
      )
    })
  }

  item.status = CacheStatus.LOADING

  return new Promise((resolve, reject) => {
    const el = document.createElement('link')

    el.rel = 'stylesheet'
    el.href = url

    bindHandlers(
      el,
      () => {
        item.status = CacheStatus.LOADED
        resolve()
      },
      evt => {
        const error = evt.error || new Error(`Load css failed. href=${url}`)

        item.status = CacheStatus.ERROR
        item.error = error

        reject(error)
      }
    )

    item.el = el
    el.setAttribute('data-runtime-import-type', 'css')
    document.head.appendChild(el)
  })
}

function uninstallACSS(url: string): Promise<void> {
  const item = cache.tryGetItemByURL(url)

  if (!item || !item.el) {
    return Promise.resolve()
  }

  if (item.status === CacheStatus.LOADING) {
    return Promise.reject(new Error(`Can NOT uninstall a loading css file.`))
  }

  document.head.removeChild(item.el)
  cache.removeItemByURL(url)

  return Promise.resolve()
}

export function installCSS(urls: Array<string>): Promise<void> {
  return Promise.all(urls.map(url => installACSS(url)))
    .then(() => {
      return Promise.resolve()
    })
    .catch(err => {
      return Promise.reject(err)
    })
}

// export function uninstallCSS(urls: Array<string>): Promise<void> {
//   return Promise.all(urls.map(url => uninstallACSS(url)))
//     .then(() => {
//       return Promise.resolve()
//     })
//     .catch(err => {
//       return Promise.reject(err)
//     })
// }

export function uninstallCSS(urls: Array<string>) {
  urls.forEach(url => uninstallACSS(url))
}
