import { test } from '@japa/runner'
import { extractFragment } from '../src/utils.js'

test.group('extractFragment', () => {
  test('simple extraction works', ({ assert }) => {
    const data = `
Before
<!-- FRAGMENT "test" -->
Inside
<!-- FRAGMENT "test" -->
After`
    const result = extractFragment(data, 'test')
    assert.equal(result, 'Inside')
  })

  test('empty extraction works', ({ assert }) => {
    const data = `
Before
<!-- FRAGMENT "test" -->
Inside
<!-- FRAGMENT "test" -->
After`
    const result = extractFragment(data, '')
    assert.equal(
      result,
      `
Before
Inside
After`
    )
  })

  test('invalid extraction throws', ({ assert }) => {
    const data = `
Before
<!-- FRAGMENT "test" -->
Inside
<!-- FRAGMENT "test" -->
After `
    assert.throws(() => extractFragment(data, 'not-test'))
  })

  test('nested extraction works', ({ assert }) => {
    const data = `
Before
<!-- FRAGMENT "test" -->
Inside before
<!-- FRAGMENT "inner-test" -->
Inside inside
<!-- FRAGMENT "inner-test" -->
Inside after
<!-- FRAGMENT "test" -->
After`
    const result = extractFragment(data, 'test')
    assert.equal(
      result,
      `Inside before
Inside inside
Inside after`
    )
  })
})
