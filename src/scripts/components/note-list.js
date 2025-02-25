class NoteList extends HTMLElement {
  constructor() {
    super();
    this._notes = [];
  }

  connectedCallback() {
    this.render();
  }

  set notes(notes) {
    this._notes = notes;
    this.render();
  }

  render() {
    this.innerHTML = `
      <style>
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          padding: 20px;
        }
        
        .add-note-card {
          background: white;
          border-radius: 8px;
          padding: 20px;
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .add-note-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #ccc;
        }

        .add-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .add-text {
          font-size: 14px;
        }
      </style>
      
      <div class="notes-grid">
        <div class="add-note-card">
          <div class="add-note-content">
            <div class="add-icon">+</div>
            <div class="add-text">Add new note</div>
          </div>
        </div>
        ${this._notes.map(note => `
          <note-item></note-item>
        `).join('')}
      </div>
    `;

    const noteItems = this.querySelectorAll('note-item');
    noteItems.forEach((item, index) => {
      item.note = this._notes[index];
    });
  }
}

customElements.define('note-list', NoteList);
