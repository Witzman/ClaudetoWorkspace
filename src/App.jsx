import React, { useState } from 'react'

function App() {
  const [notes, setNotes] = useState([{ id: 1, text: 'Hello World!' }])
  const [input, setInput] = useState('')

  function addNote() {
    if (!input.trim()) return
    setNotes([...notes, { id: Date.now(), text: input.trim() }])
    setInput('')
  }

  function deleteNote(id) {
    setNotes(notes.filter(n => n.id !== id))
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Note App</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addNote()}
          placeholder="New note..."
          style={{ flex: 1, padding: '8px 12px', fontSize: 16 }}
        />
        <button onClick={addNote} style={{ padding: '8px 16px', fontSize: 16 }}>
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {notes.map(note => (
          <li
            key={note.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              marginBottom: 8,
              background: '#f5f5f5',
              borderRadius: 6,
            }}
          >
            <span>{note.text}</span>
            <button
              onClick={() => deleteNote(note.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
