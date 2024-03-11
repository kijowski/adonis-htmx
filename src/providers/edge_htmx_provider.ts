import edge from 'edge.js'
import { ApplicationService } from '@adonisjs/core/types'
import { fragmentTag } from '../tags/fragment.js'
import { extractFragment } from '../utils.js'

export default class EdgeFragmentsServiceProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    edge.registerTag(fragmentTag)

    edge.onRender((renderer) => {
      const { render, renderSync } = renderer

      renderer.render = async function (
        combinedPath: string,
        state?: Record<string, any>
      ): Promise<string> {
        const [templatePath, fragmentName] = combinedPath.split('#')
        const original = await render.apply(renderer, [templatePath, state])
        return extractFragment(original, fragmentName)
      }

      renderer.renderSync = function (combinedPath: string, state?: Record<string, any>): string {
        const [templatePath, fragmentName] = combinedPath.split('#')
        const original = renderSync.apply(renderer, [templatePath, state])
        return extractFragment(original, fragmentName)
      }
    })
  }
}
