/**
 * css缓存
 *
 * @author yusangeng@outlook.com
 */

import { Cache, CacheItem, CacheStatus } from './cache'
import { getInstance } from '../singleton'

export interface CSSCacheItem extends CacheItem {
  el: HTMLLinkElement | null
}

const cssCache = getInstance('cssCache', () => {
  return new Cache<CSSCacheItem>((key: string) => {
    return {
      url: key,
      status: CacheStatus.NONE,
      el: null,
      error: null,
      reject: null
    }
  })
})

export default cssCache
