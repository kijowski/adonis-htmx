import type { TagContract } from 'edge.js/types'

export const fragmentTag: TagContract = {
  block: true,
  seekable: true,
  tagName: 'fragment',
  compile(parser, buffer, token) {
    const sectionName = token.properties.jsArg.trim()
    buffer.outputRaw(`\n<!-- FRAGMENT ${sectionName} -->`)
    token.children.forEach((child) => {
      parser.processToken(child, buffer)
    })
    buffer.outputRaw(`\n<!-- FRAGMENT ${sectionName} -->`)
  },
}
