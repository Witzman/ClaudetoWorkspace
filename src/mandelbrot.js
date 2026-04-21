export function iterate(cRe, cIm, maxIter) {
  const points = [{ re: 0, im: 0 }]
  let zRe = 0, zIm = 0
  for (let n = 0; n < maxIter; n++) {
    const newRe = zRe * zRe - zIm * zIm + cRe
    const newIm = 2 * zRe * zIm + cIm
    zRe = newRe
    zIm = newIm
    points.push({ re: zRe, im: zIm })
    if (zRe * zRe + zIm * zIm > 100) break
  }
  return points
}

export function toSVG(re, im, w, h, bounds) {
  const x = (re - bounds.reMin) / (bounds.reMax - bounds.reMin) * w
  const y = h - (im - bounds.imMin) / (bounds.imMax - bounds.imMin) * h
  return { x, y }
}

export function fromSVG(x, y, w, h, bounds) {
  const re = bounds.reMin + (x / w) * (bounds.reMax - bounds.reMin)
  const im = bounds.imMin + ((h - y) / h) * (bounds.imMax - bounds.imMin)
  return { re, im }
}
