import React, { useRef } from 'react'
import { toSVG, fromSVG } from './mandelbrot.js'

const SVG_W = 600
const SVG_H = 600

const DOT_COLORS = ['#888', '#4444ff', '#0088ff', '#00bbaa', '#ffaa00', '#ff4400']

function niceStep(range) {
  const raw = range / 8
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const norm = raw / mag
  if (norm < 1.5) return mag
  if (norm < 3.5) return 2 * mag
  if (norm < 7.5) return 5 * mag
  return 10 * mag
}

function gridLines(bounds) {
  const lines = []
  const reStep = niceStep(bounds.reMax - bounds.reMin)
  const imStep = niceStep(bounds.imMax - bounds.imMin)
  const reStart = Math.ceil(bounds.reMin / reStep) * reStep
  const imStart = Math.ceil(bounds.imMin / imStep) * imStep
  for (let v = reStart; v <= bounds.reMax + 1e-9; v += reStep) {
    const { x } = toSVG(v, 0, SVG_W, SVG_H, bounds)
    lines.push(<line key={`vg${v}`} x1={x} y1={0} x2={x} y2={SVG_H} stroke="#ddd" strokeWidth={0.5} />)
  }
  for (let v = imStart; v <= bounds.imMax + 1e-9; v += imStep) {
    const { y } = toSVG(0, v, SVG_W, SVG_H, bounds)
    lines.push(<line key={`hg${v}`} x1={0} y1={y} x2={SVG_W} y2={y} stroke="#ddd" strokeWidth={0.5} />)
  }
  return lines
}

function axes(bounds) {
  const origin = toSVG(0, 0, SVG_W, SVG_H, bounds)
  return (
    <>
      <line x1={0} y1={origin.y} x2={SVG_W} y2={origin.y} stroke="#999" strokeWidth={1.5} />
      <line x1={origin.x} y1={0} x2={origin.x} y2={SVG_H} stroke="#999" strokeWidth={1.5} />
    </>
  )
}

function axisLabels(bounds) {
  const labels = []
  const reStep = niceStep(bounds.reMax - bounds.reMin)
  const imStep = niceStep(bounds.imMax - bounds.imMin)
  const reStart = Math.ceil(bounds.reMin / reStep) * reStep
  const imStart = Math.ceil(bounds.imMin / imStep) * imStep
  const origin = toSVG(0, 0, SVG_W, SVG_H, bounds)

  for (let v = reStart; v <= bounds.reMax + 1e-9; v += reStep) {
    const rounded = Math.round(v * 1e9) / 1e9
    if (Math.abs(rounded) < 1e-9) continue
    const { x } = toSVG(rounded, 0, SVG_W, SVG_H, bounds)
    labels.push(
      <text key={`xl${rounded}`} x={x} y={origin.y + 16} textAnchor="middle" fontSize={11} fill="#666">
        {+rounded.toPrecision(4)}
      </text>
    )
  }

  for (let v = imStart; v <= bounds.imMax + 1e-9; v += imStep) {
    const rounded = Math.round(v * 1e9) / 1e9
    if (Math.abs(rounded) < 1e-9) continue
    const { y } = toSVG(0, rounded, SVG_W, SVG_H, bounds)
    labels.push(
      <text key={`yl${rounded}`} x={origin.x - 8} y={y + 4} textAnchor="end" fontSize={11} fill="#666">
        {+rounded.toPrecision(4)}i
      </text>
    )
  }

  labels.push(
    <text key="origin" x={origin.x + 6} y={origin.y + 14} fontSize={11} fill="#666">0</text>
  )
  return labels
}

export default function MandelbrotCanvas({ c, iterPoints, bounds, canvasRef, onMouseDown, onMouseMove, onMouseUp }) {
  const svgRef = useRef(null)

  function handleMouseMove(e) {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) * (SVG_W / rect.width)
    const py = (e.clientY - rect.top) * (SVG_H / rect.height)
    onMouseMove(fromSVG(px, py, SVG_W, SVG_H, bounds))
  }

  const cPos = toSVG(c.re, c.im, SVG_W, SVG_H, bounds)
  const displayed = iterPoints.slice(0, 6)
  const pathPoints = iterPoints.map(p => {
    const { x, y } = toSVG(p.re, p.im, SVG_W, SVG_H, bounds)
    return `${x},${y}`
  }).join(' ')

  const reSign = c.im >= 0 ? '+' : '-'
  const cLabel = `c = ${c.re.toFixed(3)} ${reSign} ${Math.abs(c.im).toFixed(3)}i`

  return (
    <div style={{ position: 'relative', display: 'inline-block', lineHeight: 0, border: '1px solid #ccc' }}>
      <canvas
        ref={canvasRef}
        width={SVG_W}
        height={SVG_H}
        style={{ position: 'absolute', top: 0, left: 0, background: '#fafafa', display: 'block' }}
      />
      <svg
        ref={svgRef}
        width={SVG_W}
        height={SVG_H}
        style={{ background: 'transparent', display: 'block', maxWidth: '100%', position: 'relative' }}
        onMouseMove={handleMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {gridLines(bounds)}
        {axes(bounds)}
        {axisLabels(bounds)}

        {iterPoints.length > 1 && (
          <polyline points={pathPoints} fill="none" stroke="#88ccff" strokeWidth={1.5} strokeOpacity={0.7} />
        )}

        {displayed.map((p, i) => {
          const { x, y } = toSVG(p.re, p.im, SVG_W, SVG_H, bounds)
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
    </div>
  )
}
