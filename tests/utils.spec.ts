import { test } from '@japa/runner'
import { createSwapHeader, createTriggerHeader } from '../src/utils.js'
import { SwapInput, TriggerInput } from '../src/types.js'

test.group('createSwapHeader', () => {
  test('create correct header for string arg', ({ assert }) => {
    const input = 'beforeend scroll:bottom'
    const result = createSwapHeader(input)

    assert.equal(result, 'beforeend scroll:bottom')
  })

  test('create correct header for boolean object arg', ({ assert }) => {
    const input: SwapInput = {
      kind: 'beforebegin',
      focusScroll: true,
      ignoreTitle: false,
      transition: true,
    }
    const result = createSwapHeader(input)

    assert.equal(result, 'beforebegin ignoreTitle:false transition:true focus-scroll:true')
  })

  test('create correct header for strings in object arg', ({ assert }) => {
    const input: SwapInput = {
      kind: 'innerHTML',
      swap: '1s',
      settle: '200ms',
      show: '#another-div:top',
    }
    const result = createSwapHeader(input)

    assert.equal(result, 'innerHTML swap:1s settle:200ms show:#another-div:top')
  })
})

test.group('createTriggerHeader simple', () => {
  test('create correct header for string arg', ({ assert }) => {
    const input = 'myEvent'
    const result = createTriggerHeader(input)

    assert.equal(result, 'myEvent')
  })

  test('create correct header for simple object arg', ({ assert }) => {
    const input: TriggerInput = {
      myEvent: 'data',
      secondEvent: {
        innerData: 'hello',
      },
    }
    const result = createTriggerHeader(input)

    assert.equal(result, '{"myEvent":"data","secondEvent":{"innerData":"hello"}}')
  })
})

test.group('createTriggerHeader create correct header when invoked multiple times', () => {
  test('with simple data', ({ assert }) => {
    const input = 'first'
    const firstResult = createTriggerHeader(input)
    const second = 'second'
    const result = createTriggerHeader(second, firstResult)

    assert.equal(result, '{"first":{},"second":{}}')
  })
  test('with complex data', ({ assert }) => {
    const input: TriggerInput = {
      myEvent: 'data',
      secondEvent: {
        innerData: 'hello',
      },
    }
    const firstResult = createTriggerHeader(input)
    const secondInput: TriggerInput = {
      third: 'hello',
    }
    const result = createTriggerHeader(secondInput, firstResult)

    assert.equal(result, '{"myEvent":"data","secondEvent":{"innerData":"hello"},"third":"hello"}')
  })

  test('with mixed data', ({ assert }) => {
    const input = 'first'
    const firstResult = createTriggerHeader(input)
    const second: TriggerInput = {
      second: 'hello',
    }
    const result = createTriggerHeader(second, firstResult)

    assert.equal(result, '{"first":{},"second":"hello"}')
  })

  test('with multiple events syntax', ({ assert }) => {
    const input = 'first, second'
    const firstResult = createTriggerHeader(input)
    const second: TriggerInput = {
      third: 'hello',
    }
    const result = createTriggerHeader(second, firstResult)

    assert.equal(result, '{"first":{},"second":{},"third":"hello"}')
  })
})
