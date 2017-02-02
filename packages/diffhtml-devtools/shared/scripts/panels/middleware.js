import { html } from 'diffhtml';
import { WebComponent, PropTypes } from 'diffhtml-components';

class DevtoolsMiddlewarePanel extends WebComponent {
  static propTypes = {
    middleware: PropTypes.array
  }

  render() {
    const { middleware } = this.props;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="ui tall segment">
        <h3>Middleware</h3>
        <p>
          View and enable/disable the various middleware registered in the
          application.
        </p>
      </div>

      <form>
        ${middleware.map(name => html`
          <div class="middleware">
            <div class="ui toggle checkbox">
              <input type="checkbox" checked ${name === 'Dev Tools' && 'disabled'}>
              <label>${name}</label>
            </div>
          </div>
        `)}
      </form>
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

customElements.define('devtools-middleware-panel', DevtoolsMiddlewarePanel);
