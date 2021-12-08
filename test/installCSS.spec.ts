/* global describe it */
import sleep from 'sleep-promise'
import { installCSS } from '../src/installer/css'

const url = '//unpkg.com/bootstrap@4.2.1/dist/css/bootstrap.css'

/* eslint no-undef: 0 */

function loose<T>(value: T) {
  return value as any
}

describe('installCSS', () => {
  describe('#installCSS', () => {
    it('should install bootstrap properly.', async () => {
      await installCSS([url])

      const els = Array.prototype.filter.call(document.querySelectorAll('link'), (el: HTMLElement) => {
        return loose(el).href === 'http:' + url
      })

      els.length.should.be.eq(1)
    }).timeout(10000)

    // it('should throw an error if URL is bad.', async () => {
    //   let error = null

    //   try {
    //     await installCSS(['foobar'])
    //   } catch (err) {
    //     // console.log(err)
    //     error = err
    //   }

    //   error.should.not.be.eq(null)
    // })
  })

  describe('#CSS cache', () => {
    it('should be cached.', async () => {
      await installCSS([url])
      await installCSS([url])

      const els = Array.prototype.filter.call(document.querySelectorAll('link'), (el: HTMLElement) => {
        return loose(el).href === 'http:' + url
      })

      els.length.should.be.eq(1)
    }).timeout(10000)

    it('should be cached if css is being loaded.', async () => {
      installCSS([url])
      installCSS([url])

      await sleep(500)

      const els = Array.prototype.filter.call(document.querySelectorAll('link'), (el: HTMLElement) => {
        return loose(el).href === 'http:' + url
      })

      els.length.should.be.eq(1)
    }).timeout(10000)
  })
})
