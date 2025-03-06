import Notes from './data/local/notes.js';

let isUpdate = false;
let updateId = null;

export const handleDeleteNote = (noteId) => {
  const confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;

  Notes.deleteNote(noteId);

  document.querySelector('note-list').notes = Notes.getUnarchived();
};

export const handleUpdateNote = (noteId, title, body) => {
  isUpdate = true;
  updateId = noteId;
  
  const noteForm = document.querySelector('note-form');
  if (noteForm) {
    noteForm.setUpdateMode(title, body);
  }
};

export const handleArchiveNote = (noteId) => {
  const confirmArchive = confirm("Are you sure you want to archive this note?");
  if (!confirmArchive) return;

  Notes.toggleArchive(noteId);

  const noteList = document.querySelector('note-list');
  if (noteList._activeTab === 'unarchived') {
    noteList.notes = Notes.getUnarchived();
  } else {
    noteList.notes = Notes.getArchived();
  }
};

export const handleNoteSubmit = (noteInfo) => {
  if (!isUpdate) {
    const newNote = {
      id: 'notes-' + Date.now(),
      title: noteInfo.title,
      body: noteInfo.body,
      createdAt: new Date().toISOString(),
      archived: false
    };
    Notes.addNote(newNote);
  } else {
    Notes.updateNote(updateId, {
      title: noteInfo.title,
      body: noteInfo.body
    });
    isUpdate = false;
    updateId = null;
  }

  const noteList = document.querySelector('note-list');
  if (noteList._activeTab === 'unarchived') {
    noteList.notes = Notes.getUnarchived();
  } else {
    noteList.notes = Notes.getArchived();
  }
};

export { isUpdate, updateId };
