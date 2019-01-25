/**
 * 缓存
 * 
 * @author Y3G
 */

export enum CacheStatus { NONE, LOADING, LOADED, ERROR }

interface CacheItem {
  status: CacheStatus,
  exportThing: any,
  el: HTMLElement | null,
  error: Error | void
}

type CacheItems = { [name: string]: CacheItem }

class Cache {
  items: CacheItems = {}

  item (key: string) : CacheItem {
    let ret = this.items[key]

    if (!ret) {
      const ret = this.items[key] = {
        status: CacheStatus.NONE,
        exportThing: void 0,
        el: null,
        error: void 0
      }

      return ret
    }

    return ret
  }
}

export default new Cache()
