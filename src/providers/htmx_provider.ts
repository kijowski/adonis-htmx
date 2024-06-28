import { HttpContext } from '@adonisjs/core/http'
import { ApplicationService } from '@adonisjs/core/types'
import { HTMXResponseHeader } from '../headers.js'
import { createSwapHeader, createTriggerHeader } from '../utils.js'
import { LocationInput, SwapInput, TriggerInput } from '../types.js'
import { renderToStream } from '@kitajs/html/suspense.js'
import { Component } from '@kitajs/html'
import Element = JSX.Element

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

  interface HtmxRenderer {
    /**
     * allows you to do a client-side redirect that does not do a full page reload
     */
    location: (target: LocationInput) => HtmxRenderer
    /**
     * pushes a new url into the history stack
     */
    pushUrl: (url: string | false) => HtmxRenderer
    /**
     * can be used to do a client-side redirect to a new location
     */
    redirect: (url: string) => HtmxRenderer
    /**
     * replaces the current URL in the location bar
     */
    replaceUrl: (url: string | false) => HtmxRenderer
    /**
     * if set to “true” the client-side will do a full refresh of the page
     */
    refresh: () => HtmxRenderer
    /**
     * allows you to specify how the response will be swapped. See hx-swap for possible values
     */
    reswap: (swap: SwapInput) => HtmxRenderer
    /**
     * a CSS selector that updates the target of the content update to a different element on the page
     */
    retarget: (cssSelector: string) => HtmxRenderer
    /**
     * a CSS selector that allows you to choose which part of the response is used to be swapped in. Overrides an existing hx-select on the triggering element
     */
    reselect: (cssSelector: string) => HtmxRenderer
    /**
     * allows you to trigger client-side events
     */
    trigger: (trigger: TriggerInput) => HtmxRenderer
    /**
     * allows you to trigger client-side events after the settle step
     */
    triggerAfterSettle: (trigger: TriggerInput) => HtmxRenderer
    /**
     * allows you to trigger client-side events after the swap step
     */
    triggerAfterSwap: (trigger: TriggerInput) => HtmxRenderer

    /**
     * render jsx component
     */
    render: <TData extends Record<string, unknown>>(
      view: Component<TData> | Element | string,
      data?: TData
    ) => Promise<JSX.Element>

    /**
     * stream jsx component
     */
    stream: <TData extends Record<string, unknown>>(
      view: Component<TData & { rid?: number | string }>,
      data?: TData,
      errorCallback?: (error: NodeJS.ErrnoException) => [string, number?]
    ) => void
  }
  interface HttpContext {
    /**
     * JSX renderer enhanced with functions tailored for HTMX
     */
    htmx: HtmxRenderer
  }
}

export default class HtmxServiceProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const app = this.app
    HttpContext.getter('htmx', function (this: HttpContext) {
      const extract = app.config.get<Function | undefined>('htmx.extract')

      let adonis = {}
      if (extract) {
        adonis = extract(this)
      }

      const htmx = {
        render: async <TData extends Record<string, unknown>>(
          view: Component<TData> | Element | string,
          data?: TData
        ) => {
          if (typeof view === 'string' || view instanceof Promise) {
            return view
          }

          return view({ ...data!, adonis })
        },
        stream: <TData extends Record<string, unknown>>(
          view: Component<TData & { rid?: number | string }>,
          data?: TData,
          errorCallback?: (error: NodeJS.ErrnoException) => [string, number?]
        ) => {
          function markup(rid: number | string) {
            return view({
              ...data!,
              rid,
              adonis,
            })
          }

          this.response.header('Content-Type', 'text/html')
          this.response.stream(renderToStream(markup), errorCallback)
        },

        location: (url: LocationInput) => {
          let header: string
          if (typeof url === 'string') {
            header = url
          } else {
            header = JSON.stringify(url)
          }
          this.response.header(HTMXResponseHeader.Location, header)
          return htmx
        },
        pushUrl: (url: string | false) => {
          this.response.header(HTMXResponseHeader.PushUrl, url.toString())
          return htmx
        },
        redirect: (url: string) => {
          this.response.header(HTMXResponseHeader.Redirect, url)
          return htmx
        },
        replaceUrl: (url: string | false) => {
          this.response.header(HTMXResponseHeader.ReplaceUrl, url.toString())
          return htmx
        },
        refresh: () => {
          this.response.header(HTMXResponseHeader.Refresh, true)
          return htmx
        },
        reswap: (swap: SwapInput) => {
          const header = createSwapHeader(swap)
          this.response.header(HTMXResponseHeader.Reswap, header)
          return htmx
        },
        retarget: (cssSelector: string) => {
          this.response.header(HTMXResponseHeader.Retarget, cssSelector)
          return htmx
        },
        reselect: (cssSelector: string) => {
          this.response.header(HTMXResponseHeader.Reselect, cssSelector)
          return htmx
        },
        trigger: (trigger: TriggerInput) => {
          const currentHeader = this.response.getHeader(HTMXResponseHeader.Trigger)
          const header = createTriggerHeader(trigger, currentHeader?.toString())
          this.response.header(HTMXResponseHeader.Trigger, header)
          return htmx
        },
        triggerAfterSettle: (trigger: TriggerInput) => {
          const currentHeader = this.response.getHeader(HTMXResponseHeader.TriggerAfterSettle)
          const header = createTriggerHeader(trigger, currentHeader?.toString())
          this.response.header(HTMXResponseHeader.TriggerAfterSettle, header)
          return htmx
        },
        triggerAfterSwap: (trigger: TriggerInput) => {
          const currentHeader = this.response.getHeader(HTMXResponseHeader.TriggerAfterSwap)
          const header = createTriggerHeader(trigger, currentHeader?.toString())
          this.response.header(HTMXResponseHeader.TriggerAfterSwap, header)
          return htmx
        },
      }

      return htmx
    })
  }
}
