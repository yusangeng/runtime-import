import { describe, it, expect } from 'vitest'
import { importComponent, importScript, importStyle } from './import-functions'

const reactURL = '//r.haier.net/assets/overlay/dts-fe/common-assets/react/16.13.1/react.development.js'
const cssURLs = [
  'https://r.haier.net/assets/overlay/dts-fe/common-assets/normalize.css/8.0.1/normalize.min.css',
  'https://r.haier.net/assets/prod/dts-fe/hxt/1.0.38/index.css'
]
const cssURL = 'https://r.haier.net/assets/overlay/dts-fe/common-assets/normalize.css/8.0.1/normalize.min.css?1'

describe('import component', () => {
  it('should import component', async () => {
    const React = await importComponent({
      scripts: {
        entry: reactURL
      },

      styles: {
        urls: cssURLs
      }
    })

    expect(React).toBeDefined()
  })
})

describe('import script', () => {
  it('should import script', async () => {
    const React = await importScript(`${reactURL}?1`)
    expect(React).toBeDefined()
  })
})

describe('import style', () => {
  it('should import style', async () => {
    await importStyle(cssURL)
    let els = document.querySelectorAll(`link[href="${cssURL}"]`)

    expect(els.length).toBe(1)
  })
})
