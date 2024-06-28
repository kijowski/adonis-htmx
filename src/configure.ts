import type Configure from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'

export async function configure(command: Configure) {
  const codemods = await command.createCodemods()

  await codemods.updateRcFile((rcFile) => {
    rcFile.addProvider('adonis-htmx/provider')
  })

  await codemods.makeUsingStub(stubsRoot, 'htmx.stub', {})
}
