import type { Component } from '@kitajs/html'

export type LocationInput =
  | string
  | {
      /** url to load the response from */
      path: string
      /** the source element of the request */
      source?: string
      /** an event that “triggered” the request */
      event?: string
      /** a callback that will handle the response HTML */
      handler?: string
      /** the target to swap the response into */
      target?: string
      /** how the response will be swapped in relative to the target */
      swap?: string
      /** values to submit with the request */
      values?: string
      /** headers to submit with the request */
      headers?: string
      /** allows you to select the content you want swapped from a response */
      select?: string
    }

export type SwapInput =
  | string
  | {
      kind:
        | 'innerHTML'
        | 'outerHTML'
        | 'beforebegin'
        | 'afterbegin'
        | 'beforeend'
        | 'afterend'
        | 'delete'
        | 'none'
      transition?: boolean
      swap?: string
      settle?: string
      ignoreTitle?: boolean
      scroll?: string
      show?: string
      focusScroll?: boolean
    }
export type TriggerInput = string | Record<string, any>

export interface HtmxConfig {
  defaultLayout?: Component
}
