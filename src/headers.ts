const HTMXRequestHeader = {
  /**
   * indicates that the request is via an element using hx-boost.
   */
  Boosted: 'HX-Boosted',
  /**
   * the current URL of the browser
   */
  CurrentUrl: 'HX-Current-URL',
  /**
   * “true” if the request is for history restoration after a miss in the local history cache
   */
  HistoryRestoreRequest: 'HX-History-Restore-Request',
  /**
   * the user response to an hx-prompt
   */
  Prompt: 'HX-Prompt',
  /**
   * always “true”
   */
  Request: 'HX-Request',
  /**
   * the id of the target element if it exists
   */
  Target: 'HX-Target',
  /**
   * the name of the triggered element if it exists
   */
  TriggerName: 'HX-Trigger-Name',
  /**
   * the id of the triggered element if it exists
   */
  Trigger: 'HX-Trigger',
}

const HTMXResponseHeader = {
  /**
   * allows you to do a client-side redirect that does not do a full page reload
   */
  Location: 'HX-Location',
  /**
   * pushes a new url into the history stack
   */
  PushUrl: 'HX-Push-Url',
  /**
   * can be used to do a client-side redirect to a new location
   */
  Redirect: 'HX-Redirect',
  /**
   * if set to “true” the client-side will do a full refresh of the page
   */
  Refresh: 'HX-Refresh',
  /**
   * replaces the current URL in the location bar
   */
  ReplaceUrl: 'HX-Replace-Url',
  /**
   * allows you to specify how the response will be swapped. See hx-swap for possible values
   */
  Reswap: 'HX-Reswap',
  /**
   * a CSS selector that updates the target of the content update to a different element on the page
   */
  Retarget: 'HX-Retarget',
  /**
   * a CSS selector that allows you to choose which part of the response is used to be swapped in. Overrides an existing hx-select on the triggering element
   */
  Reselect: 'HX-Reselect',
  /**
   * allows you to trigger client-side events
   */
  Trigger: 'HX-Trigger',
  /**
   * allows you to trigger client-side events after the settle step
   */
  TriggerAfterSettle: 'HX-Trigger-After-Settle',
  /**
   * allows you to trigger client-side events after the swap step
   */
  TriggerAfterSwap: 'HX-Trigger-After-Swap',
}

export { HTMXRequestHeader, HTMXResponseHeader }
