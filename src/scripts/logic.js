import Notes from './data/local/notes.js';

// State untuk update
let isUpdate = false;
let updateId = null;

// const addBox = document.querySelector(".add-box");
// const popUpBox = document.querySelector(".popup-box");
// const closeIcon = document.querySelector("header i");
// const titleTag = document.querySelector("input");
// const descTag = document.querySelector("textarea");
// const addBtn = popUpBox.querySelector("button");
// const popupTitle = document.querySelector("header p");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// addBox.addEventListener("click", function () {
//   titleTag.focus();
//   popUpBox.classList.add("show");
// });

// closeIcon.addEventListener("click", () => {
//   popUpBox.classList.remove("show");
//   titleTag.value = "";
//   descTag.value = "";
// });

// addBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   let noteTitle = titleTag.value,
//     noteDesc = descTag.value;
//   if (noteTitle || noteDesc) {
//     let dateObj = new Date(),
//       month = months[dateObj.getMonth()],
//       day = dateObj.getDate(),
//       year = dateObj.getFullYear();

//     let noteInfo = {
//       title: noteTitle,
//       body: noteDesc,
//       createdAt: `${month} ${day} ${year}`,
//     };
//     if (!isUpdate) {
//       Notes.addNote(noteInfo);
//     } else {
//       isUpdate = false;
//       updateId = null;
//     }
//     showNotes();
//   }
// });

// function showNotes() {
//   document.querySelectorAll(".note").forEach((note) => note.remove());
//   const notes = Notes.getUnarchived();
//   notes.forEach((note, index) => {
//     let liTag = `  <li class="note">
//       <div class="details">
//           <p>${note.title}</p>
//           <span>${note.body}</span>
//       </div>
//       <div class="bottom-content">
//           <span>${note.createdAt}</span>
//           <div class="settings">
//             <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
//             <ul class="menu">
//                 <li onclick="updateNote(${index}, '${note.title}', '${note.body}')"><i class="uil uil-pen"></i>Edit</li>
//                 <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>Delete</li>
//             </ul>
//         </div>
//       </div>
//      </li>`;
//     addBox.insertAdjacentHTML("afterend", liTag);
//   });
// }

// showNotes();

// function deleteNote(noteId) {
//   const confirmDel = confirm("Are you sure you want to delete this note?");
//   if (!confirmDel) return;

//   const notes = Notes.getAll();
//   const noteIndex = notes.findIndex(note => note.id === noteId);
//   if (noteIndex !== -1) {
//     notes.splice(noteIndex, 1);
//   }

//   showNotes();
// }

// function updateNote(noteId, title, desc) {
//   isUpdate = true;
//   updateId = noteId;
//   addBox.click();
//   titleTag.value = title;
//   descTag.value = desc;
//   addBtn.innerText = "Update Note";
//   popupTitle.innerText = "Update a Note";
// }

// function showMenu(elem) {
//   elem.parentElement.classList.add("show");
//   document.addEventListener("click", (e) => {
//     if (e.target.tagName != "I" || e.target != elem) {
//       elem.parentElement.classList.remove("show");
//     }
//   });
// }

// Event handlers untuk note-form
export const handleNoteSubmit = (noteInfo) => {
  if (!isUpdate) {
    // Tambah note baru
    const newNote = {
      id: 'notes-' + Date.now(),
      title: noteInfo.title,
      body: noteInfo.body,
      createdAt: new Date().toISOString(),
      archived: false
    };
    Notes.addNote(newNote);
  } else {
    // Update note yang ada
    const notes = Notes.getAll();
    const noteIndex = notes.findIndex(note => note.id === updateId);
    if (noteIndex !== -1) {
      notes[noteIndex] = {
        ...notes[noteIndex],
        title: noteInfo.title,
        body: noteInfo.body
      };
    }
    isUpdate = false;
    updateId = null;
  }

  // Refresh tampilan
  document.querySelector('note-list').notes = Notes.getUnarchived();
};

// Event handlers untuk note-item
export const handleDeleteNote = (noteId) => {
  const confirmDel = confirm("Are you sure you want to delete this note?");
  if (!confirmDel) return;

  const notes = Notes.getAll();
  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
  }

  // Refresh tampilan
  document.querySelector('note-list').notes = Notes.getUnarchived();
};

export const handleUpdateNote = (noteId, title, body) => {
  isUpdate = true;
  updateId = noteId;
  
  const noteForm = document.querySelector('note-form');
  noteForm.setUpdateMode(title, body);
};

export const handleArchiveNote = (noteId) => {
  const confirmArchive = confirm("Are you sure you want to archive this note?");
  if (!confirmArchive) return;

  const notes = Notes.getAll();
  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex !== -1) {
    notes[noteIndex].archived = true;
  }

  // Refresh tampilan
  document.querySelector('note-list').notes = Notes.getUnarchived();
};
