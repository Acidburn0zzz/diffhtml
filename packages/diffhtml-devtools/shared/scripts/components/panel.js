class DevtoolsPanel extends WebComponent([]) {
  render() {
    return diff.html`
      <style>
        :host {
          display: flex;
          flex: auto;
          position: relative;
          background-color: #FFFFFF;
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

customElements.define('devtools-panel', DevtoolsPanel);
