import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { Alert, type AlertTone } from '@/components/tortuga'
import { remarkAlerts } from '@/lib/remark-alerts'

const components: Components = {
  aside({ node, children, ...props }) {
    void node
    const tone = (props as Record<string, unknown>)['data-alert'] as AlertTone | undefined
    if (tone) return <Alert tone={tone}>{children}</Alert>
    return <aside {...props}>{children}</aside>
  },
}

/** Long-form content: posts and lab chapters. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="lesson-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkAlerts]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
