/**
 * Singleton.
 *
 * Applications may bundle runtime-import into a UMD script, leading to multiple runtime-import instances in a single HTML page.
 * Therefore, a globally unique instance map is needed.
 *
 * @author yusangeng@outlook.com
 */

const mapName = '__RUNTIME_IMPORT__'

export function getInstance<T>(name: string, factory: () => T) {
  type GlobalContext = {
    [mapName]: Record<string, T>
  }

  const ctx = globalThis as any as GlobalContext
  const map = ctx[mapName] ?? (ctx[mapName] = {})

  const instance: T = map[name] ?? (map[name] = factory())

  return instance
}
