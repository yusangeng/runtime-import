/**
 * 缓存
 * 
 * @author Y3G
 */

type FReject = (reason?: any) => void

export enum CacheStatus { NONE, LOADING, LOADED, ERROR }

export interface CacheItem {
  status: CacheStatus,
  exportThing: any,
  el: HTMLElement | null,
  error: Error | null,
  reject: FReject | null,
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
        error: null,
        reject: null
      }

      return ret
    }

    return ret
  }
}

export default new Cache()
