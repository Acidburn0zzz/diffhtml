class DevtoolsTransactionRow extends WebComponent([
  'key',
  'transaction',
  'stateName',
]) {
  render() {
    const { key, transaction, stateName } = this.props;
    const verb = stateName === 'completed' ? 'has' : 'is';

    return html`
      <style>${this.styles(this.props, this.state)}</style>

      <div class="transaction-row">
        Transaction #${Number(key) + 1} ${verb} ${stateName}
      </div>
    `;
  }

  styles(props, state) {
    return html`
      <style>
        :host {
          display: block;
        }

        .transaction-row {
          padding-left: 20px;
          height: 46px;
          line-height: 46px;
          background-color: #e9f9e9;
          border-bottom: 1px dotted #a3a3a3;
          color: #003f0c;
          font-weight: bold;
          cursor: pointer;
        }
      </style>
    `;
  }
}

customElements.define('devtools-transaction-row', DevtoolsTransactionRow);
