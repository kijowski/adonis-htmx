import { Response, Request } from '@adonisjs/core/http'
import { ApplicationService } from '@adonisjs/core/types'
import router from '@adonisjs/core/services/router'
import { HTMXRequestHeader, HTMXResponseHeader } from '../headers.js'
import { createSwapHeader, createTriggerHeader } from '../utils.js'
import { LocationInput, RouteDefinition, SwapInput, TriggerInput } from '../types.js'

declare module '@adonisjs/core/http' {
  interface Request {
    /**
     * Info about the request made by HTMX
     */
    htmx?: {
      /**
       * indicates that the request is via an element using hx-boost.
       */
      boosted: boolean
      /**
       * “true” if the request is for history restoration after a miss in the local history cache
       */
      historyRestore: boolean
      /**
       * the current URL of the browser
       */
      currentUrl?: string
      /**
       * the user response to an hx-prompt
       */
      prompt?: string
      /**
       * the id of the target element if it exists
       */
      target?: string
      /**
       * the id of the triggered element if it exists
       */
      trigger?: string
      /**
       * the name of the triggered element if it exists
       */
      triggerName?: string
    }
  }

  interface Response {
    /**
     * allows you to do a client-side redirect that does not do a full page reload
     */
    htmxLocation: (target: LocationInput) => Response
    /**
     * pushes a new url into the history stack
     */
    htmxPushUrl: (url: string | RouteDefinition | false) => Response
    /**
     * can be used to do a client-side redirect to a new location
     */
    htmxRedirect: (url: string | RouteDefinition) => Response
    /**
     * replaces the current URL in the location bar
     */
    htmxReplaceUrl: (url: string | RouteDefinition | false) => Response
    /**
     * if set to “true” the client-side will do a full refresh of the page
     */
    htmxRefresh: () => Response
    /**
     * allows you to specify how the response will be swapped. See hx-swap for possible values
     */
    htmxReswap: (swap: SwapInput) => Response
    /**
     * a CSS selector that updates the target of the content update to a different element on the page
     */
    htmxRetarget: (cssSelector: string) => Response
    /**
     * a CSS selector that allows you to choose which part of the response is used to be swapped in. Overrides an existing hx-select on the triggering element
     */
    htmxReselect: (cssSelector: string) => Response
    /**
     * allows you to trigger client-side events
     */
    htmxTrigger: (trigger: TriggerInput) => Response
    /**
     * allows you to trigger client-side events after the settle step
     */
    htmxTriggerAfterSettle: (trigger: TriggerInput) => Response
    /**
     * allows you to trigger client-side events after the swap step
     */
    htmxTriggerAfterSwap: (trigger: TriggerInput) => Response
  }
}

function inputUrlToString(url: string | RouteDefinition | false) {
  if (Array.isArray(url)) {
    return router.makeUrl(...url)
  }
  return url.toString()
}

export default class HtmxServiceProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    Request.getter('htmx', function (this: Request) {
      if (this.header(HTMXRequestHeader.Request)) {
        return {
          boosted: !!this.header(HTMXRequestHeader.Boosted),
          historyRestore: !!this.header(HTMXRequestHeader.HistoryRestoreRequest),
          currentUrl: this.header(HTMXRequestHeader.CurrentUrl),
          prompt: this.header(HTMXRequestHeader.Prompt),
          target: this.header(HTMXRequestHeader.Target),
          trigger: this.header(HTMXRequestHeader.Trigger),
          triggerName: this.header(HTMXRequestHeader.TriggerName),
        }
      }
    })

    Response.macro('htmxLocation', function (this: Response, url: LocationInput): Response {
      let value: string
      if (Array.isArray(url)) {
        value = router.makeUrl(...url)
      } else if (typeof url === 'string') {
        value = url
      } else {
        value = JSON.stringify({ ...url, path: inputUrlToString(url.path) })
      }
      return this.header(HTMXResponseHeader.Location, value)
    })
    Response.macro('htmxPushUrl', function (this: Response, url: string | RouteDefinition | false) {
      const value = inputUrlToString(url)
      return this.header(HTMXResponseHeader.PushUrl, value)
    })
    Response.macro('htmxRedirect', function (this: Response, url: string | RouteDefinition) {
      const value = inputUrlToString(url)
      return this.header(HTMXResponseHeader.Redirect, value)
    })
    Response.macro(
      'htmxReplaceUrl',
      function (this: Response, url: string | RouteDefinition | false) {
        const value = inputUrlToString(url)
        return this.header(HTMXResponseHeader.ReplaceUrl, value)
      }
    )
    Response.macro('htmxRefresh', function (this: Response) {
      return this.header(HTMXResponseHeader.Refresh, true)
    })
    Response.macro('htmxReswap', function (this: Response, swap: SwapInput) {
      const header = createSwapHeader(swap)
      return this.header(HTMXResponseHeader.Reswap, header)
    })
    Response.macro('htmxRetarget', function (this: Response, cssSelector: string) {
      return this.header(HTMXResponseHeader.Retarget, cssSelector)
    })
    Response.macro('htmxReselect', function (this: Response, cssSelector: string) {
      return this.header(HTMXResponseHeader.Reselect, cssSelector)
    })
    Response.macro('htmxTrigger', function (this: Response, trigger: TriggerInput) {
      const currentHeader = this.getHeader(HTMXResponseHeader.Trigger)
      const header = createTriggerHeader(trigger, currentHeader?.toString())
      return this.header(HTMXResponseHeader.Trigger, header)
    })
    Response.macro('htmxTriggerAfterSettle', function (this: Response, trigger: TriggerInput) {
      const currentHeader = this.getHeader(HTMXResponseHeader.TriggerAfterSettle)
      const header = createTriggerHeader(trigger, currentHeader?.toString())
      return this.header(HTMXResponseHeader.TriggerAfterSettle, header)
    })
    Response.macro('htmxTriggerAfterSwap', function (this: Response, trigger: TriggerInput) {
      const currentHeader = this.getHeader(HTMXResponseHeader.TriggerAfterSwap)
      const header = createTriggerHeader(trigger, currentHeader?.toString())
      return this.header(HTMXResponseHeader.TriggerAfterSwap, header)
    })
  }
}
