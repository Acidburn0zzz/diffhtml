import { html } from 'diffhtml';
import { WebComponent, PropTypes } from 'diffhtml-components';

class DevtoolsSettingsPanel extends WebComponent {
  render() {
    const { inProgress = [], completed = [] } = this.props;
    const { expandedIndex } = this.state;

    return html`
      <style>${this.styles()}</style>

      <h3>Settings</h3>
      <hr>

      <form>

      </form>
    `;
  }

  styles() {
    return `
      @import "/styles/theme.css";

      :host {
        display: block;
      }

      h3 {
        margin-top: 20px;
        margin-left: 20px;
      }
    `;
  }
}

customElements.define('devtools-settings-panel', DevtoolsSettingsPanel);
