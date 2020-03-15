/**
 * 全局define函数
 *
 * @author Y3G
 */

import { CacheItem, CacheStatus } from './cache'

const win = <any>window
const { define } = win
const { keys } = Object

let hasOtherAMDLoader = false

if (typeof define !== 'undefined' && !define.runtime_import) {
  console.warn(`runtime-import should NOT be used with requiesjs or seajs or any other AMD/CMD loader.`)
  hasOtherAMDLoader = true
}

// 脚本加载队列
const itemQueue: Array<CacheItem> = []

type FUMDDefine = {
  (...args: Array<any>): void
  n: number
  amd: boolean
  cmd: boolean
  runtime_import: boolean
}

// 模拟AMD, 注意只能用来加载UMD格式的js
const umdDefine: FUMDDefine = function define(...args: Array<any>): void {
  let factory = args.pop()
  const item = itemQueue.shift()

  if (!item) {
    throw new Error('Can NOT find item.')
  }

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
  } finally {
    dec()
  }
}

umdDefine.n = 0
umdDefine.amd = true
umdDefine.cmd = true
umdDefine.runtime_import = true

function inc(): void {
  umdDefine.n += 1

  if (umdDefine.n === 1) {
    win.define = umdDefine
  }
}

function dec(): void {
  umdDefine.n -= 1

  if (umdDefine.n === 0) {
    delete win.define
  } else if (umdDefine.n < 0) {
    umdDefine.n = 0
  }
}

export default function pushItem(item: CacheItem): void {
  if (hasOtherAMDLoader) {
    throw new Error(`runtime-import UMD mode uses window.define, your should NOT have your own window.define.`)
  }

  itemQueue.push(item)
  inc()
}
