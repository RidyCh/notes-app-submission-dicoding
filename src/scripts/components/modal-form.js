class ModalForm extends HTMLElement {
  constructor() {
    super();
    this._isUpdate = false;
    this._updateId = null;
  }

  connectedCallback() {
    this.render();
  }

  set isUpdate(value) {
    this._isUpdate = value;
    this.render();
  }

  setUpdateData(id, title, body) {
    this._isUpdate = true;
    this._updateId = id;
    this.render();
    
    // Set nilai form
    this.querySelector('#noteTitle').value = title;
    this.querySelector('#noteBody').value = body;
  }

  render() {
    this.innerHTML = `
      <style>
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }

        .modal.show {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-content {
          background: white;
          padding: 24px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
        }

        .modal-header {
          margin-bottom: 16px;
        }

        .modal-title {
          font-size: 1.2em;
          font-weight: 600;
          color: #333;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #333;
        }

        .form-input {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .form-textarea {
          min-height: 120px;
          resize: vertical;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 24px;
        }

        .btn {
          padding: 8px 16px;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          border: none;
        }

        .btn-secondary {
          background: #f5f5f5;
          color: #333;
        }

        .btn-primary {
          background: #ff69b4;
          color: white;
        }

        .btn-primary:hover {
          background: #ff1493;
        }
      </style>

      <div class="modal" id="noteModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">${this._isUpdate ? 'Edit Note' : 'Add New Note'}</h2>
          </div>
          <form id="noteForm">
            <div class="form-group">
              <label for="noteTitle" class="form-label">Title</label>
              <input type="text" id="noteTitle" class="form-input" required>
            </div>
            <div class="form-group">
              <label for="noteBody" class="form-label">Content</label>
              <textarea id="noteBody" class="form-input form-textarea" required></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').classList.remove('show')">Cancel</button>
              <button type="submit" class="btn btn-primary">${this._isUpdate ? 'Update' : 'Add'} Note</button>
            </div>
          </form>
        </div>
      </div>
    `;

    this.querySelector('#noteForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const title = this.querySelector('#noteTitle').value;
      const body = this.querySelector('#noteBody').value;

      if (this._isUpdate) {
        handleUpdateNote(this._updateId, title, body);
      } else {
        handleAddNote(title, body);
      }

      this.querySelector('#noteModal').classList.remove('show');
      this.querySelector('#noteForm').reset();
      this._isUpdate = false;
      this._updateId = null;
    });
  }

  show() {
    this.querySelector('#noteModal').classList.add('show');
  }
}

customElements.define('modal-form', ModalForm);
