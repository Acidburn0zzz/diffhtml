import { html } from 'diffhtml';
import { WebComponent, PropTypes } from 'diffhtml-components';

class DevtoolsMountsPanel extends WebComponent {
  render() {
    const { middleware } = this.props;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3>Mounts</h3>
        <p>
          Inspect the active DOM elements being rendered into.
        </p>
      </div>

      <div class="ui center aligned basic segment">
        <div class="ui left icon action input">
          <i class="search icon"></i>
          <input type="text" placeholder="Order #">
          <div class="ui blue submit button">Search</div>
        </div>

        <div class="ui horizontal divider">
          Or
        </div>

        <div class="ui teal labeled icon button">
          Create New Order
          <i class="add icon"></i>
        </div>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: block;
      }

      .middleware {
        margin-top: 20px;
        margin-left: 20px;
      }

      .ui.segment {
        border-left: 0;
        border-right: 0;
        border-top: 0;
        margin-top: 0;
      }
    `;
  }
}

customElements.define('devtools-mounts-panel', DevtoolsMountsPanel);
