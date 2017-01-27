class DevtoolsNavigation extends WebComponent([]) {
  render() {
    const { nav, selected } = this.state;

    return html`
      <style>${this.styles(this.props, this.state)}</style>

      <div class="navigation">
        <ol>
          ${nav.map((item, index) => html`
            <li index={index} selected=${selected === index}>
              ${item.label}
              ${item.subLabel && html`<span class="faded">${item.subLabel}</span>`}
            </li>
          `)}
        </ol>
      </div>
    `;
  }

  constructor() {
    super();

    this.state = {
      selected: 1,
      nav: [
        { label: 'Mounts' },
        { label: 'Transactions' },
        { label: 'Flow Tasks', subLabel: '(Middleware)' },
        { label: 'Debugging' },
      ],
    };
  }

  onClick({ target: { index: selected } }) {
    this.setState({ selected });
  }

  styles(props, state) {
    return `
      :host {
        display: flex;
        height: 100%;
        flex-basis: 200px;
        flex: none;
        background-color: #F3F3F3;
        border: 0;
        border-right: 1px solid rgb(64%, 64%, 64%);
        box-sizing: border-box;
        user-select: none;
      }

      ol {
        margin: 0;
        list-style: none;
        padding: 0;
        width: 250px;
      }

      ol li {
        width: 100%;
        height: 40px;
        background-color: #DDDDDD;
        padding: 20px;
        box-sizing: border-box;
        color: #333;
        line-height: 2px;
        cursor: pointer;
      }

      ol li:hover {
        background-color: #B4B4B4;
      }

      ol li[selected='true'] {
        background-color: #3879D9;
        color: #FFF;
      }

      span.faded {
        color: #757575;
      }
    `;
  }
}

customElements.define('devtools-navigation', DevtoolsNavigation);
