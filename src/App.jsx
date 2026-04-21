import React, { useState, useRef, useEffect } from 'react'
import MandelbrotCanvas from './MandelbrotCanvas.jsx'
import { iterate, toSVG } from './mandelbrot.js'

const DEFAULT_C = { re: -0.4, im: 0.6 }
const ITERATIONS = 20
const SVG_SIZE = 600
const DOT_COLORS = ['#888', '#4444ff', '#0088ff', '#00bbaa', '#ffaa00', '#ff4400']
const DOT_LABELS = ['z₀', 'z₁', 'z₂', 'z₃', 'z₄', 'z₅']

const VIEW_CENTER = { re: -0.5, im: 0 }
const BASE_HALF = 2
const ZOOM_STEP = 1.5

function computeBounds(zoomLevel) {
  const half = BASE_HALF / zoomLevel
  return {
    reMin: VIEW_CENTER.re - half,
    reMax: VIEW_CENTER.re + half,
    imMin: VIEW_CENTER.im - half,
    imMax: VIEW_CENTER.im + half,
  }
}

const btnStyle = {
  flex: 1,
  padding: '6px 0',
  fontSize: 18,
  cursor: 'pointer',
  background: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
  lineHeight: 1,
}

const smallBtnStyle = {
  width: '100%',
  padding: '6px 0',
  fontSize: 12,
  cursor: 'pointer',
  background: '#888',
  color: '#fff',
  border: 'none',
  borderRadius: 4,
}

export default function App() {
  const [c, setC] = useState(DEFAULT_C)
  const [dragging, setDragging] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [paintActive, setPaintActive] = useState(false)

  const canvasRef = useRef(null)
  const draggingRef = useRef(false)
  const boundsRef = useRef(null)
  const divergesRef = useRef(false)
  const paintRef = useRef(false)

  const bounds = computeBounds(zoomLevel)
  const iterPoints = iterate(c.re, c.im, ITERATIONS)
  const diverges = iterPoints.length < ITERATIONS + 1

  // keep refs in sync with latest render values
  boundsRef.current = bounds
  divergesRef.current = diverges
  paintRef.current = paintActive

  useEffect(() => {
    if (!paintRef.current || !draggingRef.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const { x, y } = toSVG(c.re, c.im, SVG_SIZE, SVG_SIZE, boundsRef.current)
    ctx.fillStyle = divergesRef.current ? '#000000' : '#ff0000'
    ctx.beginPath()
    ctx.arc(x, y, 2, 0, Math.PI * 2)
    ctx.fill()
  }, [c]) // eslint-disable-line react-hooks/exhaustive-deps

  function clearPaint() {
    if (canvasRef.current) {
      canvasRef.current.getContext('2d').clearRect(0, 0, SVG_SIZE, SVG_SIZE)
    }
  }

  function handleMouseDown() {
    draggingRef.current = true
    setDragging(true)
  }

  function handleMouseUp() {
    draggingRef.current = false
    setDragging(false)
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', background: '#f0f0f0' }}>
      <div style={{
        width: 220,
        flexShrink: 0,
        background: '#fff',
        borderRight: '1px solid #ddd',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#222' }}>
          Mandelbrot Visualizer
        </h2>

        <div style={{ fontSize: 13, color: '#444', lineHeight: 1.8 }}>
          <div><strong>Re(c)</strong> = {c.re.toFixed(3)}</div>
          <div><strong>Im(c)</strong> = {c.im.toFixed(3)}</div>
          <div style={{ marginTop: 4, color: diverges ? '#cc3300' : '#007700', fontWeight: 500 }}>
            {diverges ? `Diverges at z${iterPoints.length - 1}` : 'Converges'}
          </div>
        </div>

        <div style={{ fontSize: 13, color: '#444' }}>
          <strong>Iterations:</strong> {ITERATIONS}
        </div>

        <button
          onClick={() => { setC(DEFAULT_C); setZoomLevel(1) }}
          style={{
            padding: '7px 12px',
            fontSize: 13,
            cursor: 'pointer',
            background: '#333',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
          }}
        >
          Reset
        </button>

        <div style={{ borderTop: '1px solid #eee', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={paintActive}
              onChange={e => setPaintActive(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Paint
          </label>
          <button onClick={clearPaint} style={smallBtnStyle}>Remove paint</button>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Zoom</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button style={btnStyle} onClick={() => setZoomLevel(z => z * ZOOM_STEP)} title="Zoom in">+</button>
            <button style={btnStyle} onClick={() => setZoomLevel(z => Math.max(z / ZOOM_STEP, 0.1))} title="Zoom out">−</button>
          </div>
          <div style={{ fontSize: 11, color: '#aaa', marginTop: 4, textAlign: 'center' }}>
            {zoomLevel.toFixed(2)}×
          </div>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: 12 }}>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Legend</div>
          {DOT_LABELS.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, fontSize: 12 }}>
              <svg width={12} height={12}>
                {i === 0
                  ? <circle cx={6} cy={6} r={5} fill="white" stroke={DOT_COLORS[i]} strokeWidth={1.5} />
                  : <circle cx={6} cy={6} r={5} fill={DOT_COLORS[i]} />
                }
              </svg>
              <span style={{ color: '#444' }}>{label}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, fontSize: 12 }}>
            <svg width={12} height={12}>
              <circle cx={6} cy={6} r={5} fill="#ff8800" stroke="#fff" strokeWidth={1} />
            </svg>
            <span style={{ color: '#444' }}>c (drag me)</span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <MandelbrotCanvas
          c={c}
          iterPoints={iterPoints}
          bounds={bounds}
          canvasRef={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={newC => { if (draggingRef.current) setC(newC) }}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  )
}
