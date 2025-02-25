import Notes from '../data/local/notes.js';

const home = () => {
  console.log('Home view initialized'); // Untuk debugging
  
  const searchBar = document.querySelector('search-bar');
  const noteList = document.querySelector('note-list');
  const noteForm = document.querySelector('note-form');

  if (!noteList) {
    console.error('Note list element not found');
    return;
  }

  // Tampilkan semua notes saat pertama kali
  const notes = Notes.getUnarchived();
  console.log('Initial notes:', notes); // Untuk debugging
  noteList.notes = notes;

  // Handle pencarian
  if (searchBar) {
    searchBar.addEventListener('search', (event) => {
      const { query } = event.detail;
      const filteredNotes = Notes.searchNote(query);
      noteList.notes = filteredNotes;
    });
  }

  // Handle submit note baru
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
