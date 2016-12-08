class DevtoolsPanel extends ReactiveElement {
  render() {
    return diff.html`
      <div class="widget vbox panel">
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('devtools-panel', DevtoolsPanel);
