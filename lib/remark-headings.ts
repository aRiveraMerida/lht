// Keeps the page to one h1. The page header already renders the title, so:
//
// - a leading `# Title` in the markdown is dropped (it repeats the header),
// - any other h1 is demoted to h2,
// - headings with no text (a bare `#`, usually a pasted shell comment) go.

interface MdNode {
  type: string
  depth?: number
  value?: string
  children?: MdNode[]
}

function hasText(node: MdNode): boolean {
  if (typeof node.value === 'string' && node.value.trim()) return true
  return (node.children ?? []).some(hasText)
}

export function remarkHeadings() {
  return (tree: MdNode) => {
    const children = tree.children ?? []
    if (children[0]?.type === 'heading' && children[0].depth === 1) children.shift()

    tree.children = children.filter((node) => {
      if (node.type !== 'heading') return true
      if (!hasText(node)) return false
      if (node.depth === 1) node.depth = 2
      return true
    })
  }
}
