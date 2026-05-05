import type { Metadata } from 'next'
import { LabIndex } from '@/components/LabIndex'
import { labs } from '@/lib/labs'

export const metadata: Metadata = {
  title: 'Laboratorio · Claude Code',
  description:
    'Un recorrido completo en español por Claude Code: prework, fundamentos, configuración profesional, agentes avanzados, producción y proyectos capstone. Sin prisas.',
  alternates: { canonical: 'https://lahabitaciontortuga.com/blog/claude-code' },
}

export default function ClaudeCodeIndex() {
  return <LabIndex lab={labs['claude-code']} breadcrumbLabel="Claude Code" />
}
