/**
 * javascript cache.
 *
 * @author yusangeng@outlook.com
 */

import { Cache, CacheItem, CacheStatus } from '../utils/cache'
import { getInstance } from '../utils/singleton'

interface JSCacheItem extends CacheItem {
  el: HTMLScriptElement | null
  exportThing: any
}

const cache = getInstance('jsCache', () => {
  return new Cache<JSCacheItem>((key: string) => {
    return {
      url: key,
      status: CacheStatus.NONE,
      el: null,
      error: null,
      reject: null,
      exportThing: void 0
    }
  })
})

export { cache, JSCacheItem as CacheItem, CacheStatus }
