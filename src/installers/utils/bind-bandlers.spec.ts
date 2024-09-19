import { describe, test, expect, beforeEach } from 'vitest'
import { bindHandlers } from './bind-handlers'
import sleep from 'sleep-promise'

describe('bind-handlers', () => {
  const imgURL = 'https://r.haier.net/assets/art/tl-headerLogo.svg'
  const badURL = 'https://r.haier.net/assets/art/bad.svg'

  test('should bind handlers to element', () => {
    const el = document.createElement('img')

    bindHandlers(
      el,
      () => {
        console.log('load')
      },
      () => {
        console.error('error')
      }
    )
  })

  test('load handler should run', async () => {
    const el = document.createElement('img')
    let flag = false

    bindHandlers(
      el,
      () => {
        console.log('load')
        flag = true
      },
      () => {
        console.error('error')
      }
    )

    el.src = imgURL
    document.body.appendChild(el)

    await sleep(1000)

    console.log('expect')

    expect(flag).toBe(true)
  })

  test('error handler should run', async () => {
    const el = document.createElement('img')
    let flag = false

    bindHandlers(
      el,
      () => {
        console.log('load')
      },
      () => {
        console.error('error')
        flag = true
      }
    )

    el.src = badURL
    document.body.appendChild(el)

    await sleep(1000)

    console.log('expect')

    expect(flag).toBe(true)
  })
})
