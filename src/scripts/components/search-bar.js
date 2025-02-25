class SearchBar extends HTMLElement {
    _shadowRoot = null;
    _style = null;
   
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: 'open' });
      this._style = document.createElement('style');
      this.render();
    }
   
    connectedCallback() {
      this._shadowRoot
        .querySelector('form')
        .addEventListener('submit', this._onSubmit.bind(this));
    }
   
    disconnectedCallback() {
      this._shadowRoot
        .querySelector('form')
        .removeEventListener('submit', this._onSubmit.bind(this));
    }
   
    _onSubmit(event) {
      event.preventDefault();
      const query = this._shadowRoot.querySelector('input#searchInput').value;
   
      this.dispatchEvent(
        new CustomEvent('search', {
          detail: { query },
          bubbles: true,
        }),
      );
    }
   
    _updateStyle() {
      this._style.textContent = `
        .search-container {
          background-color: white;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin-bottom: 24px;
        }
   
        .search-form {
          display: flex;
          gap: 16px;
        }
   
        .form-group {
          flex-grow: 1;
          position: relative;
        }
   
        input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
   
        input:focus {
          outline: none;
          border-color: #ff69b4;
        }
   
        button {
          background-color: #ff69b4;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
   
        button:hover {
          background-color: #ff1493;
        }
      `;
    }
   
    render() {
      this._updateStyle();
      this._shadowRoot.innerHTML = `
        ${this._style.outerHTML}
        <div class="search-container">
          <form class="search-form">
            <div class="form-group">
              <input 
                id="searchInput" 
                type="search" 
                placeholder="Search notes..."
                required
              />
            </div>
            <button type="submit">Search</button>
          </form>
        </div>
      `;
    }
}
   
customElements.define('search-bar', SearchBar);