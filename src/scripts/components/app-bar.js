class AppBar extends HTMLElement {
  _shadowRoot = null;

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this._shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          width: 100%;
          color: white;
          padding: 16px;
        }
        
        .brand-name {
          margin: 0;
          font-size: 1.7em;
          text-align: center;
          padding: 12px 0;
          color: black;
        }
      </style>
      
      <h1 class="brand-name">Notes App</h1>
    `;
  }
}

customElements.define("app-bar", AppBar);
