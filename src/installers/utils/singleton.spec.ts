import { describe, test, expect } from 'vitest'
import { getInstance } from './singleton'

describe('singleton', () => {
  test('call getInstance with the same name', () => {
    const ins = getInstance('test-name', () => {
      return {
        magic: 42
      }
    })

    const ins2 = getInstance('test-name', () => {
      return {
        magic: 42
      }
    })

    expect(ins).equal(ins2, 'ins should be equal to ins2')
    expect(ins.magic).equal(ins2.magic, 'ins should be equal to ins2')
  })

  test('call getInstance with different name', () => {
    const ins = getInstance('test-name', () => {
      return {
        magic: 42
      }
    })

    const ins2 = getInstance('test-name-2', () => {
      return {
        magic: 42
      }
    })

    expect(ins).not.equal(ins2, 'ins should NOT be equal to ins2')
    expect(ins.magic).equal(ins2.magic, 'ins.magic should be equal to ins2.magic')
  })
})
