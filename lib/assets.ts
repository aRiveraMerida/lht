export type PreviewVariant = 'cover' | 'window' | 'shell'

const variants: PreviewVariant[] = ['cover', 'window', 'shell']

export function getPreviewVariant(index: number): PreviewVariant {
  return variants[index % variants.length]
}
