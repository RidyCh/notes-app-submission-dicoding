import { handleDeleteNote, handleUpdateNote, handleArchiveNote } from '../logic.js';

class NoteItem extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  _note = {
    id: null,
    title: null,
    body: null,
    createdAt: null,
    archived: null,
  };

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }

  set note(note) {
    this._note = note;
    this.render();
  }

  get note() {
    return this._note;
  }

  _updateStyle() {
    this._style.textContent = `
        .note-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          position: relative;
          min-height: 150px;
        }

        .note-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #333;
          padding-right: 24px;
        }

        .note-body {
          font-size: 14px;
          color: #666;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .note-date {
          font-size: 12px;
          color: #888;
          margin-top: auto;
        }

        .dropdown {
          position: absolute;
          top: 20px;
          right: 20px;
        }

        .dropdown-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          font-size: 16px;
          color: #666;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: none;
          min-width: 120px;
          z-index: 1000;
        }

        .dropdown-menu.show {
          display: block;
        }

        .dropdown-item {
          padding: 8px 16px;
          font-size: 14px;
          color: #333;
          cursor: pointer;
          display: block;
          width: 100%;
          text-align: left;
          border: none;
          background: none;
        }

        .dropdown-item:hover {
          background: #f5f5f5;
        }
      `;
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    const date = new Date(this._note.createdAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    this._shadowRoot.innerHTML = `
      ${this._style.outerHTML}
      <div class="note-card">
        <div class="dropdown">
          <button class="dropdown-toggle" onclick="this.nextElementSibling.classList.toggle('show')">⋮</button>
          <div class="dropdown-menu">
            <button class="dropdown-item" onclick="handleUpdateNote('${this._note.id}', '${this._note.title.replace(/'/g, "\\'")}', '${this._note.body.replace(/'/g, "\\'")}')">
              Edit
            </button>
            <button class="dropdown-item" onclick="handleDeleteNote('${this._note.id}')">
              Delete
            </button>
            <button class="dropdown-item" onclick="handleArchiveNote('${this._note.id}')">
              ${this._note.archived ? 'Unarchive' : 'Archive'}
            </button>
          </div>
        </div>
        <h3 class="note-title">${this._note.title}</h3>
        <div class="note-body">${this._note.body}</div>
        <div class="note-date">${formattedDate}</div>
      </div>
    `;

    // Menutup dropdown ketika klik di luar
    document.addEventListener('click', (event) => {
      const dropdowns = document.querySelectorAll('.dropdown-menu');
      dropdowns.forEach(dropdown => {
        if (!event.target.closest('.dropdown')) {
          dropdown.classList.remove('show');
        }
      });
    });
  }
}

customElements.define("note-item", NoteItem);
