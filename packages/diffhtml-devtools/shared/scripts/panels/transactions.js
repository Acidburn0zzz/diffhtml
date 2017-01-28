class DevtoolsTransactionsPanel extends WebComponent([
  'inProgress',
  'completed',
]) {
  render() {
    const { inProgress = [], completed = [] } = this.props;

    return html`
      <style>${this.styles(this.props, this.state)}</style>

      <div class="rows">
        ${completed.map((transaction, i) => html`
          <devtools-transaction-row
            stateName="completed"
            transaction=${transaction}
            key=${i}
          />
        `)}

        ${inProgress.map((transaction, i) => html`
          <devtools-transaction-row
            stateName="in progress"
            transaction=${transaction}
            key=${completed.length + i + 1}
          />
        `)}
      </div>
    `;
  }

  styles(props, state) {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
    `;
  }

  componentDidUpdate() {
    this.parentNode.scrollTop = this.parentNode.scrollHeight;
  }
}

customElements.define('devtools-transactions-panel', DevtoolsTransactionsPanel);
