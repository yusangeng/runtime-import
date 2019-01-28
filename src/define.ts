/**
 * 全局define函数
 * 
 * @author Y3G
 */

import { CacheItem, CacheStatus } from './cache'

const win = <any>window
const { define } = win

if (typeof define !== 'undefined' && !define.runtime_import) {
  throw new Error(`runtime-import should NOT be used with requiesjs or seajs or any other AMD/CMD loader.`)
}

// 脚本加载队列
const itemQueue: Array<CacheItem> = []

// 模拟AMD, 注意只能用来加载UMD格式的js
const umdDefine: any = function define (...args: Array<any>) : void {
  let factory = args[args.length - 1]
  const item = itemQueue.shift()

  if (!item) {
    throw new Error('Can NOT find item.')
  }

  try {
    item.exportThing = factory()
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