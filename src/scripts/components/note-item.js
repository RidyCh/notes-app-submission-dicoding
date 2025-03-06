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

  connectedCallback() {
    document.addEventListener('closeAllDropdowns', (e) => {
      if (e.detail?.excludeId !== this._note.id) {
        const dropdownMenu = this._shadowRoot.querySelector('.dropdown-menu');
        if (dropdownMenu) {
          dropdownMenu.classList.remove('show');
        }
      }
    });
  }

  _scrollToForm() {
    const noteForm = document.querySelector('note-form');
    if (noteForm) {
      noteForm.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
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
          <button class="dropdown-toggle">⋮</button>
          <div class="dropdown-menu">
            <button class="dropdown-item edit-btn">Edit</button>
            <button class="dropdown-item delete-btn">Delete</button>
            <button class="dropdown-item archive-btn">
              ${this._note.archived ? 'Unarchive' : 'Archive'}
            </button>
          </div>
        </div>
        <h3 class="note-title">${this._note.title}</h3>
        <div class="note-body">${this._note.body}</div>
        <div class="note-date">${formattedDate}</div>
      </div>
    `;

    const dropdownToggle = this._shadowRoot.querySelector('.dropdown-toggle');
    const dropdownMenu = this._shadowRoot.querySelector('.dropdown-menu');

    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      
      document.dispatchEvent(new CustomEvent('closeAllDropdowns', {
        detail: { excludeId: this._note.id }
      }));

      dropdownMenu.classList.toggle('show');
    });

    this._shadowRoot.querySelector('.edit-btn').addEventListener('click', () => {
      handleUpdateNote(
        this._note.id,
        this._note.title,
        this._note.body
      );
      dropdownMenu.classList.remove('show');

      setTimeout(() => {
        this._scrollToForm();
      }, 100);
    });

    this._shadowRoot.querySelector('.delete-btn').addEventListener('click', () => {
      handleDeleteNote(this._note.id);
      dropdownMenu.classList.remove('show');
    });

    this._shadowRoot.querySelector('.archive-btn').addEventListener('click', () => {
      handleArchiveNote(this._note.id);
      dropdownMenu.classList.remove('show');
    });

    const closeDropdown = (e) => {
      if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.remove('show');
      }
    };

    document.removeEventListener('click', closeDropdown);
    document.addEventListener('click', closeDropdown);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.closeDropdown);
    document.removeEventListener('closeAllDropdowns', this.handleCloseDropdowns);
  }
}

customElements.define("note-item", NoteItem);
