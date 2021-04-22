/* global describe it */
import jsCache from '../src/cache/js'
import cssCache from '../src/cache/css'

/* eslint no-undef: 0 */

describe('cache', () => {
  describe('#item', () => {
    it('getOrCreateItemByURL should return a empty item.', async () => {
      const item1 = jsCache.getOrCreateItemByURL('1')
      item1.status.should.be.eq(0)

      const item2 = cssCache.getOrCreateItemByURL('1')
      item2.status.should.be.eq(0)
    })

    it('getOrCreateItemByURL should return the same item.', async () => {
      let item1 = cssCache.getOrCreateItemByURL('2')
      let item2 = cssCache.getOrCreateItemByURL('2')

      if (item1.url !== item2.url) {
        throw new Error('item1 !== item2')
      }

      let item3 = jsCache.getOrCreateItemByURL('2')
      let item4 = jsCache.getOrCreateItemByURL('2')

      if (item3.url !== item4.url) {
        throw new Error('item3 !== item4')
      }
    })

    it('tryGetItemByURL should return null.', async () => {
      const item = cssCache.tryGetItemByURL('3')
      if (item) {
        item.should.be.eq(null)
      }
    })

    it('tryGetItemByURL should return an item.', async () => {
      const item1 = cssCache.getOrCreateItemByURL('4')
      const item2 = cssCache.tryGetItemByURL('4')

      if (!item2 || item1.url !== (item2 as any).url) {
        throw new Error('item1 !== item2')
      }
    })
  })
})
