import { describe, it, expect } from 'vitest'
import { installCSS, uninstallCSS } from './css-installer'
import { cache } from './css-installer/css-cache'

const urls = [
  'https://r.haier.net/assets/overlay/dts-fe/common-assets/normalize.css/8.0.1/normalize.min.css',
  'https://r.haier.net/assets/prod/dts-fe/hxt/1.0.38/index.css'
]

describe('CSS Installer', () => {
  it('should install and uninstall css files', async () => {
    await installCSS(urls)
    let els = document.querySelectorAll('link[data-runtime-import-type="css"]')

    expect(els.length).toBe(2)

    await uninstallCSS(urls)
    els = document.querySelectorAll('link[data-runtime-import-type="css"]')

    expect(els.length).toBe(0)
  })
})

describe('CSS Cache', () => {
  it('should cache css files', async () => {
    await installCSS(urls)
    await installCSS(urls)
    const els = document.querySelectorAll('link[data-runtime-import-type="css"]')

    expect(els.length).toBe(2)

    // 注意：这里没有引用计数
    uninstallCSS(urls)
  })

  it('cache should be valid even if the first install pending', async () => {
    await Promise.all([installCSS(urls), installCSS(urls)])

    const els = document.querySelectorAll('link[data-runtime-import-type="css"]')

    expect(els.length).toBe(2)
  })

  it('cache should be removed by uninstallCSS', async () => {
    await installCSS(urls)

    expect(Object.values(cache.items).filter(el => !!el).length).toBe(2)

    await uninstallCSS(urls)

    expect(Object.values(cache.items).filter(el => !!el).length).toBe(0)
  })
})
