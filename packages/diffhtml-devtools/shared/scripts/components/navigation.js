class DevtoolsNavigation extends WebComponent([]) {
  render() {
    const { nav, selected } = this.state;

    return html`
      <style>${this.styles(this.props, this.state)}</style>

      <div class="navigation">
        <ol>
          ${nav.map((item, index) => html`
            <li index=${index} selected=${selected === index} onclick=${() => this.onClick(index)}>
              <span class="label">
                ${item.icon && html`<i class="shrink-icon icono-${item.icon}"></i>`}
                ${item.label}
                ${item.subLabel && html`<span class="faded">${item.subLabel}</span>`}
              </span>
            </li>
          `)}
        </ol>
      </div>
    `;
  }

  styles(props, state) {
    return `
      @import "../styles/icono.css";

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
        position: sticky;
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

      ol li span.label i {
        color: #AF8585;
        left: -7px;
      }

      ol li:hover {
        background-color: #B4B4B4;
      }

      ol li[selected='true'] {
        background-color: #737373;
        color: #FFF;
      }

      ol li:first-child span.label i {
        left: -4px;
      }

      ol li[selected='true'] span.label i {
        color: #FFF;
      }

      span.faded {
        color: #757575;
      }

      span.label {
        position: relative;
        top: -15px;
      }

      span.label i {
        transform: scale(0.6,0.6);
      }
    `;
  }

  constructor() {
    super();

    this.state = {
      selected: 0,

      nav: [
        { label: 'Transactions', icon: 'list' },
        { label: 'Mounts', icon: 'sitemap' },
        { label: 'Middleware', icon: 'chain' },
        { label: 'Resources', icon: 'cup' },
        { label: 'Help!', icon: 'exclamationCircle' },
        { label: 'Settings', icon: 'gear' },
      ],
    };

    this.onClick = this.onClick.bind(this);
  }

  onClick(selected) {
    this.setState({ selected });
  }
}

customElements.define('devtools-navigation', DevtoolsNavigation);
