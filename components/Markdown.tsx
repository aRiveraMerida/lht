import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Alert, type AlertTone } from '@/components/tortuga'
import { CodeBlock } from '@/components/CodeBlock'
import { remarkAlerts } from '@/lib/remark-alerts'
import { remarkHeadings } from '@/lib/remark-headings'

interface HastNode {
  properties?: { className?: unknown }
  children?: HastNode[]
}

// Most fences in the guides carry no language. Detection gives them colour,
// limited to what the content actually uses so it can't guess anything exotic.
const HIGHLIGHT = {
  detect: true,
  subset: ['bash', 'javascript', 'typescript', 'json', 'yaml', 'python', 'sql', 'markdown', 'xml'],
}

/** The fence's language, from the `language-*` class on the inner code. */
function languageOf(pre?: HastNode): string | undefined {
  const classes = pre?.children?.[0]?.properties?.className
  if (!Array.isArray(classes)) return undefined
  const match = classes.map(String).find((c) => c.startsWith('language-'))
  return match?.slice('language-'.length)
}

const components: Components = {
  aside({ node, children, ...props }) {
    void node
    const tone = (props as Record<string, unknown>)['data-alert'] as AlertTone | undefined
    if (tone) return <Alert tone={tone}>{children}</Alert>
    return <aside {...props}>{children}</aside>
  },
  pre({ node, children }) {
    return <CodeBlock lang={languageOf(node as HastNode)}>{children}</CodeBlock>
  },
}

/** Long-form content: posts and lab chapters, set for reading. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="lesson-body article-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkHeadings, remarkAlerts]}
        rehypePlugins={[[rehypeHighlight, HIGHLIGHT], rehypeRaw]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
