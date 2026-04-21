import React, { useRef } from 'react'
import { toSVG, fromSVG } from './mandelbrot.js'

const SVG_W = 600
const SVG_H = 600
export const BOUNDS = { reMin: -2.5, reMax: 1.5, imMin: -2, imMax: 2 }

const DOT_COLORS = ['#888', '#4444ff', '#0088ff', '#00bbaa', '#ffaa00', '#ff4400']

function gridLines() {
  const lines = []
  for (let v = -2.5; v <= 1.5; v += 0.5) {
    const { x } = toSVG(v, 0, SVG_W, SVG_H, BOUNDS)
    lines.push(<line key={`vg${v}`} x1={x} y1={0} x2={x} y2={SVG_H} stroke="#ddd" strokeWidth={0.5} />)
  }
  for (let v = -2; v <= 2; v += 0.5) {
    const { y } = toSVG(0, v, SVG_W, SVG_H, BOUNDS)
    lines.push(<line key={`hg${v}`} x1={0} y1={y} x2={SVG_W} y2={y} stroke="#ddd" strokeWidth={0.5} />)
  }
  return lines
}

function axes() {
  const origin = toSVG(0, 0, SVG_W, SVG_H, BOUNDS)
  return (
    <>
      <line x1={0} y1={origin.y} x2={SVG_W} y2={origin.y} stroke="#999" strokeWidth={1.5} />
      <line x1={origin.x} y1={0} x2={origin.x} y2={SVG_H} stroke="#999" strokeWidth={1.5} />
    </>
  )
}

function axisLabels() {
  const ticks = [-2, -1, 1, 2]
  const labels = []
  ticks.forEach(v => {
    const { x } = toSVG(v, 0, SVG_W, SVG_H, BOUNDS)
    const { y: oy } = toSVG(0, 0, SVG_W, SVG_H, BOUNDS)
    labels.push(
      <text key={`xl${v}`} x={x} y={oy + 16} textAnchor="middle" fontSize={11} fill="#666">{v}</text>
    )
    const { y } = toSVG(0, v, SVG_W, SVG_H, BOUNDS)
    const { x: ox } = toSVG(0, 0, SVG_W, SVG_H, BOUNDS)
    labels.push(
      <text key={`yl${v}`} x={ox - 8} y={y + 4} textAnchor="end" fontSize={11} fill="#666">{v}i</text>
    )
  })
  const origin = toSVG(0, 0, SVG_W, SVG_H, BOUNDS)
  labels.push(
    <text key="origin" x={origin.x + 6} y={origin.y + 14} fontSize={11} fill="#666">0</text>
  )
  return labels
}

export default function MandelbrotCanvas({ c, iterPoints, onMouseDown, onMouseMove, onMouseUp }) {
  const svgRef = useRef(null)

  function handleMouseMove(e) {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) * (SVG_W / rect.width)
    const py = (e.clientY - rect.top) * (SVG_H / rect.height)
    onMouseMove(fromSVG(px, py, SVG_W, SVG_H, BOUNDS))
  }

  const cPos = toSVG(c.re, c.im, SVG_W, SVG_H, BOUNDS)
  const displayed = iterPoints.slice(0, 6)
  const pathPoints = iterPoints.map(p => {
    const { x, y } = toSVG(p.re, p.im, SVG_W, SVG_H, BOUNDS)
    return `${x},${y}`
  }).join(' ')

  const reSign = c.im >= 0 ? '+' : '-'
  const cLabel = `c = ${c.re.toFixed(3)} ${reSign} ${Math.abs(c.im).toFixed(3)}i`

  return (
    <svg
      ref={svgRef}
      width={SVG_W}
      height={SVG_H}
      style={{ background: '#fafafa', border: '1px solid #ccc', display: 'block', maxWidth: '100%' }}
      onMouseMove={handleMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {gridLines()}
      {axes()}
      {axisLabels()}

      {iterPoints.length > 1 && (
        <polyline points={pathPoints} fill="none" stroke="#88ccff" strokeWidth={1.5} strokeOpacity={0.7} />
      )}

      {displayed.map((p, i) => {
        const { x, y } = toSVG(p.re, p.im, SVG_W, SVG_H, BOUNDS)
        const color = DOT_COLORS[i]
        return i === 0
          ? <circle key={i} cx={x} cy={y} r={5} fill="white" stroke={color} strokeWidth={2} />
          : <circle key={i} cx={x} cy={y} r={5} fill={color} />
      })}

      <circle
        cx={cPos.x}
        cy={cPos.y}
        r={9}
        fill="#ff8800"
        stroke="#fff"
        strokeWidth={2}
        style={{ cursor: 'grab' }}
        onMouseDown={onMouseDown}
      />

      <text
        x={cPos.x + 14}
        y={cPos.y - 10}
        fontSize={12}
        fill="#333"
        style={{ userSelect: 'none', pointerEvents: 'none' }}
      >
        {cLabel}
      </text>
    </svg>
  )
}
