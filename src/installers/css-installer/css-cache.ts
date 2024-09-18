/**
 * Css cache.
 *
 * @author yusangeng@outlook.com
 */

import { Cache, CacheItem, CacheStatus } from '../utils/cache'
import { getInstance } from '../utils/singleton'

interface CSSCacheItem extends CacheItem {
  el: HTMLLinkElement | null
}

const cache = getInstance('cssCache', () => {
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

export { cache, CacheStatus }
