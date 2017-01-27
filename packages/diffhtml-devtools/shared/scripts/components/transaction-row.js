class DevtoolsTransactionRow extends WebComponent([]) {
  render() {
    return diff.html`<div class="transaction-row">Here...</div>`;
  }

  styles() {
    return diff.html`
      <style>
        :host {
          display: block;
        }
      </style>
    `;
  }
}

customElements.define('devtools-transaction-row', DevtoolsTransactionRow);
