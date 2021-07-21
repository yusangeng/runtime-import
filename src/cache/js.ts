/**
 * js缓存
 *
 * @author yusangeng@outlook.com
 */

import { Cache, CacheItem, CacheStatus } from './cache'
import { getInstance } from '../singleton'

export interface JSCacheItem extends CacheItem {
  el: HTMLScriptElement | null
  exportThing: any
}

const jsCache = getInstance('jsCache', () => {
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

export default jsCache
