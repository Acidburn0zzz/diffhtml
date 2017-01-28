class DevtoolsHeader extends WebComponent(['version']) {
  render() {
    return html`
      <style>
        :host {
          background-color: #fff;
          color: #333;
          padding: 16px;
          font-weight: bold;
          border-bottom: 4px solid #3879d9;
          text-align: right;
        }
      </style>

      <slot></slot>
    `;
  }
}

customElements.define('devtools-header', DevtoolsHeader);
