'use client';

import React, { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

const LABELS: Record<string, string> = {
  bash: 'Terminal', sh: 'Terminal', shell: 'Terminal', zsh: 'Terminal', console: 'Terminal',
  js: 'JavaScript', javascript: 'JavaScript', ts: 'TypeScript', typescript: 'TypeScript',
  jsx: 'JSX', tsx: 'TSX', json: 'JSON', yaml: 'YAML', yml: 'YAML', toml: 'TOML',
  py: 'Python', python: 'Python', sql: 'SQL', html: 'HTML', css: 'CSS',
  md: 'Markdown', markdown: 'Markdown', diff: 'Diff', gs: 'Apps Script',
};

/**
 * A fenced code block: a slim header with the language and a copy button,
 * then the highlighted code. The pre is focusable because it scrolls.
 */
export function CodeBlock({ lang, children }: { lang?: string; children: React.ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const label = lang ? (LABELS[lang] ?? lang) : 'Texto';

  const copy = async () => {
    const text = preRef.current?.innerText ?? '';
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the code stays selectable by hand */
    }
  };

  return (
    <figure className="code-block">
      <figcaption className="code-block-head">
        <span className="code-block-lang">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="code-block-copy"
          aria-label={copied ? 'Código copiado' : `Copiar código (${label})`}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          <span aria-hidden="true">{copied ? 'Copiado' : 'Copiar'}</span>
        </button>
      </figcaption>
      <pre ref={preRef} tabIndex={0}>{children}</pre>
    </figure>
  );
}
