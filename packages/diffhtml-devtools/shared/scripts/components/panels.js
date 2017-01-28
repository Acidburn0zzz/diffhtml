class DevtoolsPanels extends WebComponent([]) {
  render() {
    return html`
      <style>
        :host {
          display: flex;
          flex: auto;
          position: relative;
          background-color: #FFFFFF;
          overflow-y: auto;
        }

        .panel {
          box-sizing: border-box;
          display: flex;
          flex: 1;
          flex-direction: column;
        }
      </style>

      <div class="panel">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('devtools-panels', DevtoolsPanels);
