/**
 * 全局define函数
 *
 * @author Y3G
 */

import { CacheStatus } from '../cache/cache'
import { JSCacheItem } from '../cache/js'

const win = <any>window
const { define } = win
const { keys } = Object

let hasOtherAMDLoader = false

if (typeof define !== 'undefined' && !define.runtime_import) {
  console.warn(`runtime-import should NOT be used with requiesjs or seajs or any other AMD/CMD loader.`)
  hasOtherAMDLoader = true
}

const pendingItemMap: Record<string, JSCacheItem | null> = {}

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

  let { src } = currentScript as HTMLScriptElement
  let item = pendingItemMap[src]

  if (!item) {
    src = src.replace(new RegExp(`^${window.location.protocol}`), '')
    item = pendingItemMap[src]

    if (!item) {
      throw new Error(`Can NOT find item, src=${src}`)
    }
  }

  pendingItemMap[src] = null

  try {
    let externals = args[0] || []
    let name = null

    if (typeof externals === 'string') {
      name = externals
      externals = args[1] || []
    }

    const exportThing = (item.exportThing = factory(
      ...externals.map((el: string) => {
        return win[el]
      })
    ))

    if (name) {
      win[name] = exportThing
    }

    if (exportThing && keys(exportThing).length === 1 && exportThing.default) {
      item.exportThing = exportThing.default
    }
  } catch (err) {
    item.status = CacheStatus.ERROR
    item.error = err
    item.reject!(err)
  }
}

umdDefine.amd = true
umdDefine.cmd = true
umdDefine.runtime_import = true

export default function addItem(src: string, item: JSCacheItem): void {
  if (hasOtherAMDLoader) {
    throw new Error(`runtime-import UMD mode uses window.define, your should NOT have your own window.define.`)
  }

  if (!win.define) {
    win.define = umdDefine
  }

  pendingItemMap[src] = item
}
