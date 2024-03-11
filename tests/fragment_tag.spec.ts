import { test } from '@japa/runner'
import { fragmentTag } from '../src/tags/fragment.js'
import edge from 'edge.js'

test.group('fragmentTag', () => {
  edge.registerTag(fragmentTag)
  test('simple extraction works', ({ assert }) => {
    const input = `Before
@fragment("test")
Inside
@end
After`
    const result = edge.renderRawSync(input)
    assert.equal(
      result,
      `Before
<!-- FRAGMENT "test" -->
Inside
<!-- FRAGMENT "test" -->
After`
    )
  })
})
