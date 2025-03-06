import { handleNoteSubmit } from "../logic.js";

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
    const titleInput = this.querySelector("#noteTitle");
    const bodyInput = this.querySelector("#noteBody");
    const submitButton = this.querySelector(".form-button");

    titleInput.value = title;
    bodyInput.value = body;
    submitButton.textContent = "Update Note";
    
    this._validateForm();
  }

  resetForm() {
    this._isUpdate = false;
    const form = this.querySelector("#noteForm");
    const submitButton = this.querySelector(".form-button");

    form.reset();
    submitButton.textContent = "Add Note";
    
    this._resetValidation();
  }

  _showValidation(input, errorElement, countElement) {
    const length = input.value.trim().length;
    const maxLength = input.getAttribute('maxLength');
    countElement.textContent = `${length}/${maxLength}`;
    countElement.classList.add('show');
    
    if (input.id === 'noteTitle') {
      if (length < 3) {
        input.classList.add('error');
        errorElement.textContent = 'Title must be at least 3 characters long';
        errorElement.classList.add('show');
      } else if (length > 50) {
        input.classList.add('error');
        errorElement.textContent = 'Title cannot exceed 50 characters';
        errorElement.classList.add('show');
      } else {
        input.classList.remove('error');
        errorElement.classList.remove('show');
      }
    } else { 
      if (length < 10) {
        input.classList.add('error');
        errorElement.textContent = 'Content must be at least 10 characters long';
        errorElement.classList.add('show');
      } else if (length > 1000) {
        input.classList.add('error');
        errorElement.textContent = 'Content cannot exceed 1000 characters';
        errorElement.classList.add('show');
      } else {
        input.classList.remove('error');
        errorElement.classList.remove('show');
      }
    }

    countElement.classList.toggle('error', length > maxLength);
  }

  _hideValidation(input, errorElement, countElement) {
    input.classList.remove('error');
    errorElement.classList.remove('show');
    countElement.classList.remove('show');
  }

  _validateForm() {
    const titleInput = this.querySelector("#noteTitle");
    const bodyInput = this.querySelector("#noteBody");
    const submitButton = this.querySelector(".form-button");

    const titleLength = titleInput.value.trim().length;
    const bodyLength = bodyInput.value.trim().length;

    const isTitleValid = titleLength >= 3 && titleLength <= 50;
    const isBodyValid = bodyLength >= 10 && bodyLength <= 1000;
    
    submitButton.disabled = !(isTitleValid && isBodyValid);

    return isTitleValid && isBodyValid;
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
          margin-bottom: 24px;
          position: relative;
        }
        
        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #333;
        }
        
        .form-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #ff69b4;
          box-shadow: 0 0 0 2px rgba(255,105,180,0.1);
        }

        .form-input.error {
          border-color: #ff4444;
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 2px rgba(255,68,68,0.1);
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
          transition: all 0.3s ease;
        }
        
        .form-button:hover:not(:disabled) {
          background-color: #ff1493;
        }

        .form-button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
          opacity: 0.7;
        }

        .error-message {
          color: #ff4444;
          font-size: 12px;
          margin-top: 4px;
          position: absolute;
          bottom: -20px;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }

        .error-message.show {
          opacity: 1;
          transform: translateY(0);
        }

        .character-count {
          position: absolute;
          right: 0;
          bottom: -20px;
          font-size: 12px;
          color: #666;
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.3s ease;
        }

        .character-count.show {
          opacity: 1;
          transform: translateY(0);
        }

        .character-count.error {
          color: #ff4444;
        }
      </style>
      
      <form class="note-form" id="noteForm">
        <div class="form-group">
          <label for="noteTitle" class="form-label">Title</label>
          <input 
            type="text" 
            id="noteTitle" 
            class="form-input" 
            maxlength="50"
            required
          >
          <div class="error-message" id="titleError"></div>
          <div class="character-count" id="titleCount">0/50</div>
        </div>
        <div class="form-group">
          <label for="noteBody" class="form-label">Content</label>
          <textarea 
            id="noteBody" 
            class="form-input form-textarea" 
            maxlength="1000"
            required
          ></textarea>
          <div class="error-message" id="bodyError"></div>
          <div class="character-count" id="bodyCount">0/1000</div>
        </div>
        <button type="submit" class="form-button" disabled>Add Note</button>
      </form>
    `;

    const titleInput = this.querySelector("#noteTitle");
    const bodyInput = this.querySelector("#noteBody");
    const titleError = this.querySelector("#titleError");
    const bodyError = this.querySelector("#bodyError");
    const titleCount = this.querySelector("#titleCount");
    const bodyCount = this.querySelector("#bodyCount");

    titleInput.addEventListener("focus", () => {
      this._showValidation(titleInput, titleError, titleCount);
    });

    titleInput.addEventListener("blur", () => {
      this._hideValidation(titleInput, titleError, titleCount);
    });

    bodyInput.addEventListener("focus", () => {
      this._showValidation(bodyInput, bodyError, bodyCount);
    });

    bodyInput.addEventListener("blur", () => {
      this._hideValidation(bodyInput, bodyError, bodyCount);
    });

    titleInput.addEventListener("input", () => {
      if (document.activeElement === titleInput) {
        this._showValidation(titleInput, titleError, titleCount);
      }
      this._validateForm();
    });

    bodyInput.addEventListener("input", () => {
      if (document.activeElement === bodyInput) {
        this._showValidation(bodyInput, bodyError, bodyCount);
      }
      this._validateForm();
    });

    this.querySelector("#noteForm").addEventListener("submit", (event) => {
      event.preventDefault();
      
      if (this._validateForm()) {
        const title = titleInput.value.trim();
        const body = bodyInput.value.trim();
        
        handleNoteSubmit({ title, body });
        this.resetForm();
      }
    });
  }

  _resetValidation() {
    const inputs = this.querySelectorAll(".form-input");
    const errors = this.querySelectorAll(".error-message");
    const counts = this.querySelectorAll(".character-count");
    const submitButton = this.querySelector(".form-button");

    inputs.forEach(input => input.classList.remove("error"));
    errors.forEach(error => error.classList.remove("show"));
    counts.forEach(count => {
      count.classList.remove('error', 'show');
    });
    submitButton.disabled = true;
  }
}

customElements.define("note-form", NoteForm);
