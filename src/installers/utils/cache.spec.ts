import { describe, test, expect, beforeEach } from 'vitest'
import { Cache, CacheItem, CacheStatus } from './cache'

describe('cache', () => {
  let currentUserData = 0

  interface Item extends CacheItem {
    userData: number
  }

  let cache: Cache<Item>

  beforeEach(() => {
    cache = new Cache<Item>((key: string) => {
      return {
        url: key,
        status: CacheStatus.LOADING,
        el: null,
        error: null,
        reject: null,
        userData: currentUserData++
      }
    })
  })

  test('create cache object', () => {
    const newCache = new Cache<Item>(() => {
      return {
        url: '',
        status: CacheStatus.LOADING,
        el: null,
        error: null,
        reject: null,
        userData: -1
      }
    })

    expect(newCache).toBeInstanceOf(Cache<Item>)
  })

  test('create cache item by getOrCreateItemByURL', () => {
    const item = cache.getOrCreateItemByURL('http://example.com')

    expect(item.url).toBe('http://example.com')
    expect(item.status).toBe(CacheStatus.LOADING)
    expect(item.el).toBeNull()
    expect(item.error).toBeNull()
    expect(item.reject).toBeNull()
    expect(item.userData).toBe(currentUserData - 1)
  })

  test('get cache item by tryGetItemByURL', () => {
    const item = cache.tryGetItemByURL('http://example.com')

    expect(item).toBeNull()

    cache.getOrCreateItemByURL('http://example.com')

    const item2 = cache.tryGetItemByURL('http://example.com')

    expect(item2).not.toBeNull()
    expect(item2!.url).toBe('http://example.com')
    expect(item2!.status).toBe(CacheStatus.LOADING)
    expect(item2!.el).toBeNull()
    expect(item2!.error).toBeNull()
    expect(item2!.reject).toBeNull()
    expect(item2!.userData).toBe(currentUserData - 1)
  })

  test('remove cache item by removeItemByURL', () => {
    cache.getOrCreateItemByURL('http://example.com')
    cache.getOrCreateItemByURL('http://example.com/2')

    let item = cache.removeItemByURL('http://example.com')
    let item2 = cache.removeItemByURL('http://example.com/2')

    expect(item).not.toBeNull()
    expect(item2).not.toBeNull()

    item = cache.removeItemByURL('http://example.com')
    item2 = cache.removeItemByURL('http://example.com/2')

    expect(item).toBeNull()
    expect(item2).toBeNull()
  })
})
