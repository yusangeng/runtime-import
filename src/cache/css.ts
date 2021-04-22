/**
 * css缓存
 *
 * @author Y3G
 */

import { Cache, CacheItem, CacheStatus } from './cache'

export interface CSSCacheItem extends CacheItem {
  el: HTMLLinkElement | null
}

const cache = new Cache<CSSCacheItem>((key: string) => {
  return {
    url: key,
    status: CacheStatus.NONE,
    el: null,
    error: null,
    reject: null
  }
})

//;(window as any).csscache = cache

export default cache
