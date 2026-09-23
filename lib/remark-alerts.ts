// Turns GitHub-style alerts into Tortuga alerts:
//
//   > [!WARNING]
//   > Esto borra la rama.
//
// The blockquote becomes <aside data-alert="warning">, which the Markdown
// component renders with <Alert>. No dependency on unist-util-visit: it is
// only a transitive dependency here, so a small walk does the job.

import type { AlertTone } from '@/components/tortuga'

const TONES: Record<string, AlertTone> = {
  NOTE: 'note',
  IMPORTANT: 'note',
  TIP: 'success',
  WARNING: 'warning',
  CAUTION: 'error',
}

const MARKER = /^\[!(NOTE|IMPORTANT|TIP|WARNING|CAUTION)\][ \t]*\n?/

interface MdNode {
  type: string
  value?: string
  children?: MdNode[]
  data?: { hName?: string; hProperties?: Record<string, unknown> }
}

function transform(node: MdNode) {
  if (node.type === 'blockquote') {
    const first = node.children?.[0]
    const text = first?.type === 'paragraph' ? first.children?.[0] : undefined
    const match = text?.type === 'text' ? text.value?.match(MARKER) : null
    if (first && text && match) {
      text.value = text.value!.slice(match[0].length)
      // "[!NOTE]" alone on its line leaves an empty text node and a break.
      if (text.value === '') first.children!.shift()
      if (first.children![0]?.type === 'break') first.children!.shift()
      if (first.children!.length === 0) node.children!.shift()
      node.data = { hName: 'aside', hProperties: { dataAlert: TONES[match[1]] } }
    }
  }
  node.children?.forEach(transform)
}

export function remarkAlerts() {
  return (tree: MdNode) => transform(tree)
}
