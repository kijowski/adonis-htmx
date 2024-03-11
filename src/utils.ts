const fragmentRegex = /<!-- FRAGMENT ".*" -->\s*/g

export function extractFragment(content: string, sectionName: string | undefined): string {
  if (sectionName === undefined || sectionName === '') {
    return content.replaceAll(fragmentRegex, '')
  }
  const parts = content.split(`<!-- FRAGMENT "${sectionName}" -->`)
  const section = parts[1]
  if (section === undefined) {
    throw new Error(`Failed to find ${sectionName}`)
  }
  return section.replaceAll(fragmentRegex, '').trim()
}
