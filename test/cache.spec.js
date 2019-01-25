import 'babel-polyfill'
import cache from '../src/cache'

/* eslint no-undef: 0 */

describe('cache', () => {
  describe('#item', () => {
    it('should return a empty item.', async () => {
      const item = cache.item('foobar')
      item.status.should.be.eq(0)
    })

    it('should return the same item.', async () => {
      const item1 = cache.item('foobar')
      const item2 = cache.item('foobar')

      item1.should.be.eq(item2)
    })
  })
})
