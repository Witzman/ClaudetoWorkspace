import React, { useState } from 'react'
import MandelbrotCanvas from './MandelbrotCanvas.jsx'
import { iterate } from './mandelbrot.js'

const DEFAULT_C = { re: -0.4, im: 0.6 }
const ITERATIONS = 20
const DOT_COLORS = ['#888', '#4444ff', '#0088ff', '#00bbaa', '#ffaa00', '#ff4400']
const DOT_LABELS = ['z₀', 'z₁', 'z₂', 'z₃', 'z₄', 'z₅']

export default function App() {
  const [c, setC] = useState(DEFAULT_C)
  const [dragging, setDragging] = useState(false)

  const iterPoints = iterate(c.re, c.im, ITERATIONS)
  const diverges = iterPoints.length < ITERATIONS + 1

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
          onClick={() => setC(DEFAULT_C)}
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
          onMouseDown={() => setDragging(true)}
          onMouseMove={newC => { if (dragging) setC(newC) }}
          onMouseUp={() => setDragging(false)}
        />
      </div>
    </div>
  )
}
