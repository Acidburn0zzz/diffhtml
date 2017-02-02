import { html } from 'diffhtml';
import { WebComponent, PropTypes } from 'diffhtml-components';
import SemanticUITable from '../semantic-ui/table';

class DevtoolsTransactionsPanel extends WebComponent {
  static propTypes = {
    inProgress: PropTypes.array,
    completed: PropTypes.array,
    inspect: PropTypes.func,
  }

  render() {
    const { inProgress = [], completed = [], inspect } = this.props;
    const { expandedIndex } = this.state;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <div class="rows">
        <!--<semantic-ui-table ui celled sortable selectable structured table striped>-->
        <table class="ui celled sortable selectable structured table striped">
          <thead>
            <tr>
              <th rowspan="2"></th>
              <th class="center aligned" rowspan="2">FPS</th>
              <th class="center aligned" rowspan="2">Status</th>
              <th class="center aligned" rowspan="2">DOM Node</th>
              <th class="center aligned" rowspan="2">Transitions</th>
              <th class="center aligned" colspan="4">DOM Tree Changes</th>
              <th class="center aligned" colspan="2">Attribute Changes</th>
            </tr>

            <tr>
              <th class="center aligned">Insert</th>
              <th class="center aligned">Replace</th>
              <th class="center aligned">Remove</th>
              <th class="center aligned">Node Value</th>
              <th class="center aligned">Set Attribute</th>
              <th class="center aligned">Remove Attribute</th>
            </tr>
          </thead>

          ${completed.map((transaction, index) => html`
            <devtools-transaction-row
              key=${index}
              index=${index}
              stateName="completed"
              transaction=${transaction.args}
              startTime=${transaction.startDate}
              endTime=${transaction.endDate}
              isExpanded=${expandedIndex === index}
              toggleExpanded=${this.toggleExpanded}
              inspect=${inspect}
            />
          `)}

          ${inProgress.map((transaction, index) => html`
            <devtools-transaction-row
              key=${completed.length + index}
              index=${completed.length + index}
              startTime=${transaction.startDate}
              endTime=${transaction.endDate}
              stateName="in progress"
              transaction=${transaction.args}
              isExpanded=${expandedIndex === index}
              toggleExpanded=${this.toggleExpanded}
              inspect=${inspect}
            />
          `)}
        </table>
      </div>
    `;
  }

  styles() {
    return `
      :host {
        display: block;
      }

      thead {
        position: sticky;
        top: 0px;
        background-color: #f3f3f3;
        z-index: 100;
      }

      thead th {
        position: relative;
      }

      thead th:before {
        content: '';
        display: block;
        position: absolute;
        top: -1px;
        bottom: -1px;
        left: -1px;
        right: -1px;
        border: 1px solid #B1B1B1;
        border-top: none;
      }

      thead th:first-child:before {
        border-left: none;
      }

      thead th:last-child:before {
        border-right: none;
      }
    `;
  }

  constructor() {
    super();

    this.state = { expandedIndex: -1, autoScroll: true };
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  componentDidUpdate() {
    const { expandedIndex, autoScroll } = this.state;

    if (expandedIndex === -1 && autoScroll) {
      this.parentNode.scrollTop = this.parentNode.scrollHeight;
    }
  }

  toggleExpanded(index) {
    const expandedIndex = this.state.expandedIndex === index ? -1 : index;
    this.setState({ autoScroll: false, expandedIndex });
  }
}

customElements.define('devtools-transactions-panel', DevtoolsTransactionsPanel);
