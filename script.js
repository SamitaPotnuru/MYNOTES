const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');
const noteContent = document.getElementById('noteContent');
const deleteNoteBtn = document.getElementById('deleteNoteBtn');

let notes = JSON.parse(localStorage.getItem('notes')) || [];
let activeNoteId = null;

// Render sidebar notes
function renderNotes() {
  notesList.innerHTML = '';
  notes.forEach(note => {
    const li = document.createElement('li');
    li.textContent = note.title || 'Untitled Note';
    li.dataset.id = note.id;
    if (note.id === activeNoteId) li.classList.add('active');
    notesList.appendChild(li);
  });
}

// Save notes to localStorage
function saveNotes() {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Add new note
addNoteBtn.addEventListener('click', () => {
  const newNote = { id: Date.now(), title: 'Untitled Note', content: '' };
  notes.push(newNote);
  activeNoteId = newNote.id;
  noteContent.disabled = false;
  noteContent.value = '';
  deleteNoteBtn.disabled = false;
  saveAndRender();
});

// Select a note
notesList.addEventListener('click', e => {
  if (e.target.tagName === 'LI') {
    activeNoteId = Number(e.target.dataset.id);
    const note = notes.find(n => n.id === activeNoteId);
    noteContent.disabled = false;
    noteContent.value = note.content;
    deleteNoteBtn.disabled = false;
    renderNotes();
  }
});

// Update note in real time
noteContent.addEventListener('input', () => {
  const note = notes.find(n => n.id === activeNoteId);
  if (note) {
    note.content = noteContent.value;
    note.title = noteContent.value.split('\n')[0] || 'Untitled Note';
    saveAndRender();
  }
});

// Delete note
deleteNoteBtn.addEventListener('click', () => {
  if (!activeNoteId) return;
  if (confirm('Are you sure you want to delete this note?')) {
    notes = notes.filter(n => n.id !== activeNoteId);
    activeNoteId = notes.length ? notes[0].id : null;
    noteContent.value = activeNoteId ? notes.find(n => n.id === activeNoteId).content : '';
    noteContent.disabled = !activeNoteId;
    deleteNoteBtn.disabled = !activeNoteId;
    saveAndRender();
  }
});

// Helper: Save and render
function saveAndRender() {
  saveNotes();
  renderNotes();
}

// Initial render
renderNotes();
if (notes.length) {
  activeNoteId = notes[0].id;
  noteContent.value = notes[0].content;
  noteContent.disabled = false;
  deleteNoteBtn.disabled = false;
}
