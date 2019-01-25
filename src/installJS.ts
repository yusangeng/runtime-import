/**
 * 加载JS
 * 
 * @author Y3G
 */

import cache, { CacheStatus } from './cache'

const { define } = <any>window

const err = new Error(`runtime-import should NOT be used with requiesjs or seajs or any other AMD/CMD loader.`)

if (define === null || (typeof define !== 'undefined' && !define.runtime_import)) {
  throw err
}

function installAJS (url: string) : Promise<any> {
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

  item.status = CacheStatus.LOADING

  return new Promise((resolve, reject) => {
    const el = document.createElement('script')

    el.src = url
    el.async = false // 保持时序

    const win = <any>window

    // 模拟AMD
    const define: any = function define (...args: Array<any>) : void {
      let factory = args[args.length - 1]

      try {
        item.exportThing = factory()
      } catch (err) {
        item.status = CacheStatus.ERROR
        item.error = err
        reject(err)
      }
    }

    define.amd = true
    win.define = define

    el.addEventListener('load', () => {
      delete win.define
      item.status = CacheStatus.LOADED
      resolve(item.exportThing)
    })

    el.addEventListener('error', evt => {
      const error = evt.error || new Error(`Load javascript failed. src=${url}`)

      delete win.define
      item.status = CacheStatus.ERROR
      item.error = error
      reject(error)
    })

    item.el = el
    document.body.appendChild(el)
  })
}

export default function installJS (urls: Array<string>) : Promise<any> {
  let chain = Promise.resolve()

  urls.forEach(url => {
    chain = chain.then(_ => installAJS(url))
  })

  return chain
}
