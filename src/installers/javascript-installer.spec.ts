import { describe, it, expect } from 'vitest'
import { installJS } from './javascript-installer'
//import { cache } from './javascript-installer/javascript-cache'

//const reactURL = '//r.haier.net/assets/overlay/dts-fe/common-assets/react/16.13.1/react.development.js'
const lodashURL = '//r.haier.net/assets/overlay/dts-fe/common-assets/lodash/4.17.21/lodash.min.js'
const jqueryURL = '//r.haier.net/assets/overlay/dts-fe/common-assets/jquery/3.5.1/jquery.min.js'

describe('Javascript Installer', () => {
  it('should install javascript file', async () => {
    await expect(async () => await installJS([lodashURL], { umd: false, crossOrigin: '' })).not.toThrow()

    const els = document.querySelectorAll(`script[src="${lodashURL}"]`)

    expect(els.length).toBe(1)
  })

  it('should install javascript umd file then return export object', async () => {
    const jquery = await installJS([jqueryURL], { umd: true, crossOrigin: '' })
    const els = document.querySelectorAll(`script[src="${jqueryURL}"]`)

    console.log(jquery)

    expect(els.length).toBe(1)
    expect(jquery).toBeDefined()
    expect(jquery('body').length).toBe(1)
  })
})

describe('Javascript Cache', () => {
  it('should cache umd-js export object', async () => {
    const jquery = await installJS([jqueryURL], { umd: true, crossOrigin: '' })

    jquery.magic = 42

    const jquery2 = await installJS([jqueryURL], { umd: true, crossOrigin: '' })

    expect(jquery2.magic).toBe(42)
  })
})
