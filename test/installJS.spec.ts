/* global describe it */
import sleep from 'sleep-promise'
import { installJS } from '../src/installer/js'

const reactURL = '//r.haier.net/assets/overlay/dts-fe/common-assets/react/16.13.1/react.development.js'
const lodashURL = '//r.haier.net/assets/overlay/dts-fe/common-assets/lodash/4.17.21/lodash.min.js'
const jqueryURL = '//r.haier.net/assets/overlay/dts-fe/common-assets/jquery/3.5.1/jquery.min.js'

/* eslint no-undef: 0 */

function loose<T>(value: T) {
  return value as any
}

describe('installJS', () => {
  describe('#installJS', () => {
    it('should install react properly.', async () => {
      const React = await installJS([reactURL], {})

      const t = typeof React.Component
      t.should.eq('function')
    }).timeout(10000)

    // it('should throw an error if URL is bad.', async () => {
    //   let error = null

    //   try {
    //     await installJS(['foobar'])
    //   } catch (err) {
    //     // console.log(err)
    //     error = err
    //   }

    //   error.should.not.be.eq(null)
    // })
  })

  describe('#JS cache', () => {
    it('should return cached value if js has been loaded.', async () => {
      const React = await installJS([reactURL], {})

      const t = typeof React.Component
      t.should.eq('function')

      const els = Array.prototype.filter.call(document.querySelectorAll('script'), (el: HTMLElement) => {
        return loose(el).src === 'http:' + reactURL
      })

      els.length.should.be.eq(1)
    }).timeout(10000)

    it('should return cached value if js is being loaded.', async () => {
      installJS([jqueryURL], {})
      installJS([jqueryURL], {})

      await sleep(500)

      const els = Array.prototype.filter.call(document.querySelectorAll('script'), (el: HTMLElement) => {
        return loose(el).src === 'http:' + jqueryURL
      })

      els.length.should.be.eq(1)
    }).timeout(10000)
  })

  describe('#amdFlagCheater', () => {
    it('should ignore lodash umd entry properly.', async () => {
      const el = document.createElement('script')

      el.setAttribute('src', lodashURL)
      el.setAttribute('async', 'false')

      document.body.appendChild(el)

      await sleep(2000)

      const t = typeof (window as any)._

      t.should.be.eq('function')
    }).timeout(10000)
  })
})
