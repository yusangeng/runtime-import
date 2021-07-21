/**
 * 全局单例
 *
 * @author yusangeng@outlook.com
 */

const win = window as any

let { __RUNTIME_IMPORT__ } = win

if (!__RUNTIME_IMPORT__) {
  win.__RUNTIME_IMPORT__ = __RUNTIME_IMPORT__ = {}
}

export function getInstance<T>(key: string, factory: () => T) {
  let value: T = __RUNTIME_IMPORT__[key]

  if (typeof value === 'undefined') {
    value = __RUNTIME_IMPORT__[key] = factory()
  }

  return value
}
