export type LightboxState = {
  src: string
  alt: string
  /** Bounding box of the thumbnail the image flies from/to */
  from: { x: number; y: number; w: number; h: number }
}

export const useLightbox = () => {
  const state = useState<LightboxState | null>('lightbox', () => null)

  function open(src: string, el: HTMLElement, alt = '') {
    const r = el.getBoundingClientRect()
    state.value = { src, alt, from: { x: r.left, y: r.top, w: r.width, h: r.height } }
  }

  function close() {
    state.value = null
  }

  return { state, open, close }
}
