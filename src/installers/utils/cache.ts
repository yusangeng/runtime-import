/**
 * 缓存
 *
 * @author yusangeng@outlook.com
 */

type FReject = (reason?: any) => void

export enum CacheStatus {
  NONE,
  LOADING,
  LOADED,
  ERROR
}

export interface CacheItem {
  url: string
  status: CacheStatus
  el: HTMLElement | null
  error: Error | null
  reject: FReject | null
}

type CacheItems<CacheValue extends CacheItem> = Record<string, CacheValue | null>

export class Cache<CacheValue extends CacheItem> {
  items: CacheItems<CacheValue> = {}
  private factory: (key: string) => CacheValue

  constructor(factory: (key: string) => CacheValue) {
    this.factory = factory
  }

  getOrCreateItemByURL(key: string): CacheValue {
    let ret = this.items[key]

    if (!ret) {
      ret = this.items[key] = this.factory(key)
    }

    return ret
  }

  tryGetItemByURL(key: string): CacheValue | null {
    return this.items[key] ?? null
  }

  removeItemByURL(key: string) {
    const ret = this.items[key]

    if (!ret) {
      return ret
    }

    this.items[key] = null

    return ret
  }
}
