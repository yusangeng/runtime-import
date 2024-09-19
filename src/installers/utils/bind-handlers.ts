/**
 * Bind DOM handlers.
 *
 * @author yusangeng@outlook.com
 */

export function bindHandlers(
  el: HTMLLinkElement | HTMLScriptElement | HTMLImageElement,
  handleLoad: () => void,
  handleError: (evt: ErrorEvent) => void
) {
  const handlers = {
    handleLoad() {
      el.removeEventListener('load', handlers.handleLoad)
      el.removeEventListener('error', handlers.handleError as EventListener)
      handleLoad()
    },
    handleError(evt: ErrorEvent) {
      el.removeEventListener('load', handlers.handleLoad)
      el.removeEventListener('error', handlers.handleError as EventListener)
      handleError(evt)
    }
  }

  el.addEventListener('load', handlers.handleLoad)
  el.addEventListener('error', handlers.handleError as EventListener)
}
