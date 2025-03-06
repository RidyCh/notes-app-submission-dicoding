import Notes from '../data/local/notes.js';

class NoteList extends HTMLElement {
  constructor() {
    super();
    this._notes = [];
    this._isUpdate = false;
    this._activeTab = 'unarchived';
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._notes = this._activeTab === 'unarchived' ? 
      Notes.getUnarchived() : Notes.getArchived();
    this.render();
  }

  set notes(notes) {
    this._notes = notes;
    this.render();
  }

  switchTab(tabName) {
    this._activeTab = tabName;
    this._notes = tabName === 'unarchived' ? 
      Notes.getUnarchived() : Notes.getArchived();
    this.render();
  }

  refreshNotes() {
    this._notes = this._activeTab === 'unarchived' ? 
      Notes.getUnarchived() : Notes.getArchived();
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 2px solid #ddd;
        }

        .tab {
          padding: 10px 20px;
          cursor: pointer;
          border: none;
          background: none;
          font-size: 16px;
          color: #666;
          position: relative;
        }

        .tab.active {
          color: #ff1493;
        }

        .tab.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #ff1493;
        }

        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .add-note-card {
          min-height: 150px;
          background: white;
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px dashed #ddd;
          transition: all 0.3s ease;
        }

        .add-note-card:hover {
          border-color: #ff1493;
          background: #fff5f8;
        }

        .add-note-card i {
          font-size: 32px;
          color: #ff1493;
        }

        .add-note-card p {
          margin-top: 10px;
          color: #666;
        }

        .no-notes {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .not-found-message {
          text-align: center;
          font-size: 18px;
          color: #ff0000;
          margin: 20px 0;
          padding: 10px;
          border: 1px solid #ff0000;
          border-radius: 5px;
          background-color: #ffe6e6;
        }

        .refresh-button {
          margin: 20px 0;
          padding: 10px 20px;
          background-color: #ff69b4;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .refresh-button:hover {
          background-color: #ff1493;
        }
      </style>

      <div class="container">
        <div class="tabs">
          <button class="tab ${this._activeTab === 'unarchived' ? 'active' : ''}" 
                  data-tab="unarchived">
            Active Notes
          </button>
          <button class="tab ${this._activeTab === 'archived' ? 'active' : ''}" 
                  data-tab="archived">
            Archived Notes
          </button>
        </div>

        <button class="refresh-button">Refresh Notes</button>

        <div class="notes-grid">
          ${this._notes.length ? 
            this._notes.map(note => `<note-item></note-item>`).join('') :
            `<div class="no-notes">
              ${this._activeTab === 'unarchived' ? 
                'No active notes found' : 
                'No archived notes found'}
            </div>`
          }
        </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchTab(tab.dataset.tab);
      });
    });

    this.shadowRoot.querySelector('.refresh-button').addEventListener('click', () => {
      this.refreshNotes();
    });

    const noteItems = this.shadowRoot.querySelectorAll('note-item');
    noteItems.forEach((item, index) => {
      item.note = this._notes[index];
    });
  }
}

customElements.define('note-list', NoteList);
