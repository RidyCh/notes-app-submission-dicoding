import Notes from '../data/local/notes.js';

const home = () => {
  
  const searchBar = document.querySelector('search-bar');
  const noteList = document.querySelector('note-list');
  const noteForm = document.querySelector('note-form');

  if (!noteList) {
    console.error('Note list element not found');
    return;
  }

  const notes = Notes.getUnarchived();
  noteList.notes = notes;

  if (searchBar) {
    searchBar.addEventListener('search', (event) => {
      const { query } = event.detail;
      const filteredNotes = Notes.searchNote(query);
      noteList.notes = filteredNotes;
    });
  }

  if (noteForm) {
    noteForm.addEventListener('note-submit', (event) => {
      const { title, body } = event.detail;
      const newNote = {
        id: 'notes-' + Date.now(),
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false
      };
      
      Notes.addNote(newNote);
      noteList.notes = Notes.getUnarchived();
    });
  }
};

export default home;
