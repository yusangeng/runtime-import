/**
 * A fake AMD defined function.
 *
 * @author yusangeng@outlook.com
 */

import { CacheStatus, CacheItem } from './javascript-cache'
import { getInstance } from '../utils/singleton'

const win = globalThis as any
const { define } = win
const { keys } = Object

let hasOtherAMDLoader = false

if (typeof define !== 'undefined' && !define.runtime_import) {
  console.warn(`runtime-import should NOT coexist with requiesjs or seajs or any other AMD/CMD loader.`)
  hasOtherAMDLoader = true
}

const pendingItemMap = getInstance<Record<string, CacheItem | null>>('pendingItemMap', () => ({}))

type FUMDDefine = {
  (...args: Array<any>): void
  amd: boolean
  cmd: boolean
  runtime_import: boolean
}

// 模拟AMD, 注意只能用来加载UMD格式的js
const umdDefine: FUMDDefine = function define(...args: Array<any>): void {
  const factory = args.pop()
  const { currentScript } = document

  if (!currentScript) {
    throw new Error(`currentScript is null.`)
  }

  const { src } = currentScript as HTMLScriptElement
  const item = pendingItemMap[src]

  if (!item) {
    throw new Error(`Can NOT find item, src=${src}`)
  }

  pendingItemMap[src] = null

  try {
    let externals = args[0] || []
    let name = null

    if (typeof externals === 'string') {
      name = externals
      externals = args[1] || []
    }

    const exportThing = (item.exportThing = (() => {
      let useCurrentExports = false
      const currentExports = {}

      let ret = factory(
        ...externals.map((el: string) => {
          // exports会被直接用于写导出对象，如果传入undefined会导致报错
          if (el === 'exports') {
            useCurrentExports = true
            return currentExports
          }

          return win[el]
        })
      )

      if (!ret && useCurrentExports) {
        ret = currentExports
      }

      return ret
    })())

    if (name) {
      win[name] = exportThing
    }

    if (exportThing && keys(exportThing).length === 1 && exportThing.default) {
      item.exportThing = exportThing.default
      item.exportThing.default = exportThing.default
    }
  } catch (err) {
    item.status = CacheStatus.ERROR
    if (err instanceof Error) {
      item.error = err
    }
    item.reject!(err)
  }
} as FUMDDefine

const amdFlagCheater = () => {
  const { currentScript } = document

  if (currentScript) {
    const { src } = currentScript as HTMLScriptElement
    const item = pendingItemMap[src]

    if (item) {
      return true
    }
  }

  return false
}

;['amd', 'cmd'].forEach(el => {
  Object.defineProperty(umdDefine, el, {
    get: amdFlagCheater
  })
})

// private flag
umdDefine.runtime_import = true

export default function addItem(src: string, item: CacheItem): void {
  if (hasOtherAMDLoader) {
    throw new Error(`runtime-import UMD mode uses window.define, you should NOT have your own window.define.`)
  }

  if (!win.define) {
    win.define = umdDefine
  }

  pendingItemMap[src] = item
}
