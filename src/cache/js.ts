/**
 * js缓存
 *
 * @author Y3G
 */

import { Cache, CacheItem, CacheStatus } from './cache'

export interface JSCacheItem extends CacheItem {
  el: HTMLScriptElement | null
  exportThing: any
}

const cache = new Cache<JSCacheItem>((key: string) => {
  return {
    url: key,
    status: CacheStatus.NONE,
    el: null,
    error: null,
    reject: null,
    exportThing: void 0
  }
})

//;(window as any).jscache = cache

export default cache
