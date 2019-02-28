/**
 * 全局define函数
 * 
 * @author Y3G
 */

import { CacheItem, CacheStatus } from './cache'

const win = <any>window
const { define } = win
const { keys } = Object

if (typeof define !== 'undefined' && !define.runtime_import) {
  throw new Error(`runtime-import should NOT be used with requiesjs or seajs or any other AMD/CMD loader.`)
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
const umdDefine: FUMDDefine = function define (...args: Array<any>) : void {
  let factory = args.pop()
  const item = itemQueue.shift()

  if (!item) {
    throw new Error('Can NOT find item.')
  }

  try {
    const externals = args.shift() || []
    const exportThing = item.exportThing = factory(...externals.map((el: string) => {
      return win[el]
    }))

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

function inc () : void {
  umdDefine.n += 1

  if (umdDefine.n === 1) {
    win.define = umdDefine
  }
}

function dec () : void {
  umdDefine.n -= 1

  if (umdDefine.n === 0) {
    delete win.define
  } else if (umdDefine.n < 0) {
    umdDefine.n = 0
  }
}

export default function pushItem (item: CacheItem) {
  itemQueue.push(item)
  inc()
}