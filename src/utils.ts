import { SwapInput, TriggerInput } from './types.js'

export function createSwapHeader(swap: SwapInput): string {
  let header: string
  if (typeof swap === 'string') {
    header = swap
  } else {
    const { kind, focusScroll, ...rest } = swap
    header = `${swap.kind}`
    Object.entries(rest).forEach(function ([key, value]) {
      if (value !== undefined) {
        header += ` ${key}:${value}`
      }
    })
    if (focusScroll !== undefined) {
      header += ` focus-scroll:${focusScroll}`
    }
  }
  return header
}

export function createTriggerHeader(trigger: TriggerInput, currentHeader?: string): string {
  if (currentHeader === undefined) {
    let header: string
    if (typeof trigger === 'string') {
      header = trigger
    } else {
      header = JSON.stringify(trigger)
    }
    return header
  }
  let headerDict: Record<string, any>
  try {
    headerDict = JSON.parse(currentHeader)
  } catch (e) {
    headerDict = {}
    for (const event of currentHeader.split(',')) {
      headerDict[event.trim()] = {}
    }
  }

  if (typeof trigger === 'string') {
    for (const event of trigger.split(',')) {
      headerDict[event.trim()] = {}
    }
  } else {
    headerDict = { ...headerDict, ...trigger }
  }
  return JSON.stringify(headerDict)
}
