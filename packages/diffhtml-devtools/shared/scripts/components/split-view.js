class DevtoolsSplitView extends WebComponent([]) {
  render() {
    return diff.html`
      <style>
        :host {
          display: flex;
          flex: 1;
          flex-direction: row;
        }

        .split-view {
          display: flex;
          width: 100%;
        }
      </style>

      <div class="split-view">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('devtools-split-view', DevtoolsSplitView);
