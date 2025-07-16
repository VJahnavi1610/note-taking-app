import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('notes');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : false;
  });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const addOrUpdateNote = () => {
    if (input.trim()) {
      if (editIndex !== null) {
        const updatedNotes = [...notes];
        updatedNotes[editIndex].text = input;
        setNotes(updatedNotes);
        setEditIndex(null);
      } else {
        const newNote = {
          text: input,
          createdAt: new Date().toLocaleString(),
        };
        setNotes([newNote, ...notes]);
      }
      setInput('');
    }
  };

  const deleteNote = (index) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = notes.filter((_, i) => i !== index);
      setNotes(updatedNotes);
    }
  };

  const editNote = (index) => {
    setInput(notes[index].text);
    setEditIndex(index);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>📝 My Notes</h1>
        <button className="toggle-dark" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <div className="input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your note..."
        />
        <button onClick={addOrUpdateNote}>{editIndex !== null ? 'Update' : 'Add'}</button>
      </div>

      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {filteredNotes.length === 0 ? (
        <p>No matching notes found.</p>
      ) : (
        filteredNotes.map((note, index) => (
          <div className="note fade-in" key={index}>
            <p className="note-time">📅 Created: {note.createdAt}</p>
            <p className="note-text">{note.text}</p>
            <div className="note-actions">
              <button onClick={() => editNote(index)}>✏️ Edit</button>
              <button onClick={() => deleteNote(index)}>🗑️ Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
