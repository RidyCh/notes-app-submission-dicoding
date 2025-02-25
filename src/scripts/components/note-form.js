import { handleNoteSubmit } from '../logic.js';

class NoteForm extends HTMLElement {
  constructor() {
    super();
    this._isUpdate = false;
  }

  connectedCallback() {
    this.render();
  }

  setUpdateMode(title, body) {
    this._isUpdate = true;
    const titleInput = this.querySelector('#noteTitle');
    const bodyInput = this.querySelector('#noteBody');
    const submitButton = this.querySelector('.form-button');
    
    titleInput.value = title;
    bodyInput.value = body;
    submitButton.textContent = 'Update Note';
  }

  resetForm() {
    this._isUpdate = false;
    const form = this.querySelector('#noteForm');
    const submitButton = this.querySelector('.form-button');
    
    form.reset();
    submitButton.textContent = 'Add Note';
  }

  render() {
    this.innerHTML = `
      <style>
        .note-form {
          background: white;
          padding: 24px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .form-group {
          margin-bottom: 16px;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }
        
        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1em;
        }
        
        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        .form-button {
          background-color: #ff69b4;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          width: 100%;
        }
        
        .form-button:hover {
          background-color: #ff1493;
        }
      </style>
      
      <form class="note-form" id="noteForm">
        <div class="form-group">
          <label for="noteTitle" class="form-label">Title</label>
          <input type="text" id="noteTitle" class="form-input" required>
        </div>
        <div class="form-group">
          <label for="noteBody" class="form-label">Content</label>
          <textarea id="noteBody" class="form-input form-textarea" required></textarea>
        </div>
        <button type="submit" class="form-button">Add Note</button>
      </form>
    `;

    this.querySelector('#noteForm').addEventListener('submit', (event) => {
      event.preventDefault();
      const title = this.querySelector('#noteTitle').value;
      const body = this.querySelector('#noteBody').value;
      
      handleNoteSubmit({ title, body });
      this.resetForm();
    });
  }
}

customElements.define('note-form', NoteForm);
