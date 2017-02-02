import { html } from 'diffhtml';
import { WebComponent, PropTypes } from 'diffhtml-components';
import SemanticUITable from '../semantic-ui/table';

class DevtoolsTransactionRow extends WebComponent {
  static propTypes = {
    index: PropTypes.number,
    transaction: PropTypes.shape({
      aborted: PropTypes.bool,
      patches: PropTypes.shape({
        TREE_OPS: PropTypes.array,
        SET_ATTRIBUTE: PropTypes.array,
        REMOVE_ATTRIBUTE: PropTypes.array,
        NODE_VALUE: PropTypes.array,
      }),
    }),
    stateName: PropTypes.string,
    toggleExpanded: PropTypes.func,
    inspect: PropTypes.func,
    isExpanded: PropTypes.bool,
    startTime: PropTypes.number,
    endTime: PropTypes.number,
  }

  render() {
    const { getColorFromStat } = this;
    const {
      startTime,
      endTime,
      index,
      transaction,
      stateName,
      toggleExpanded,
      isExpanded,
    } = this.props;
    const { stats } = this.state;

    const {
      domNode = '',
      aborted = false,
      promises = [],
      patches = {
        TREE_OPS: [],
        SET_ATTRIBUTE: [],
        REMOVE_ATTRIBUTE: [],
        NODE_VALUE: [],
      },
    } = transaction;

    let unnecessaryRender = true;

    Object.keys(stats).some(statName => {
      if (stats[statName]) {
        unnecessaryRender = false;
        return true;
      }
    });

    const fps = endTime ? 1000 / (endTime - startTime) : Infinity;

    return html`
      <link rel="stylesheet" href="/styles/theme.css">
      <style>${this.styles()}</style>

      <td class="center aligned">
        ${unnecessaryRender && transaction.completed && html`
          <div
            data-tooltip="Nothing changed, unnecessary render!"
            data-position="right center"
          >
            <i class="icon warning sign yellow" />
          </div>
        `}
      </td>

      <td class="center aligned">
        ${fps && (
          fps === Infinity && '&infin;' ||
          fps >= 60 && '>=60' ||
          fps.toFixed(1)
        )}
      </td>

      <td class="center aligned">
        ${aborted ? 'Aborted' : (
          stateName === 'completed' ? 'Completed' : 'In Progress'
        )}
      </td>

      <td class="center aligned" onclick=${this.inspectNode}>
        <div class="node">
          &lt;${domNode} /&gt;
        </div>
      </td>

      <td class="center aligned">
        <strong><a href="#transaction-promises">${String(promises.length)}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.insert)}">
        <strong><a href="#transaction-insert">${stats.insert}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.replace)}">
        <strong><a href="#transaction-replace">${stats.replace}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.remove)}">
        <strong><a href="#transaction-remove">${stats.remove}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.nodeValue)}">
        <strong><a href="#transaction-node-value">${stats.nodeValue}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.setAttribute)}">
        <strong><a href="#transaction-set-attribute">${stats.setAttribute}</a></strong>
      </td>

      <td class="center aligned ${getColorFromStat(stats.removeAttribute)}">
        <strong><a href="#transaction-remove-attribute">${stats.removeAttribute}</a></strong>
      </td>

      ${isExpanded && html`
        <div>
          <h3>Transaction #${index + 1} Summary</h3>
          <p>Was aborted? ${String(aborted)}</p>
        </div>
      `}
    `;

  }

  styles() {
    return `
      ${SemanticUITable}

      :host {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
        user-select: none;
      }

      :host(:hover) td {
        background-color: #f3f3f3;
        cursor: pointer;
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

      .transaction-expanded {
        border-bottom: 2px solid #61b563;
        padding: 20px;
      }

      h3 {
        margin-top: 0;
      }

      i.icon.warning.sign {
        background-color: transparent;
      }

      .node {
        color: #91248A;
        font-family: "dejavu sans mono", monospace;
        font-size: 11px;
      }

      .center.aligned {
        text-align: center;
      }

      td {
        padding: 10px;
      }

      .red { background-color: #f1b1b1; }
      .red a { color: #772e2e; }

      .yellow { background-color: #ffeba0; }
      .yellow a { color: #ef7c11; }

      .green { background-color: #a5dea5; }
      .green a { color: #009407; }
    `;
  }

  constructor() {
    super();

    this.state = {
      stats: {
        insert: 0,
        replace: 0,
        remove: 0,
        nodeValue: 0,
        setAttribute: 0,
        removeAttribute: 0,
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { transaction } = nextProps;
    const { patches } = transaction;

    if (!patches) { return; }

    const { TREE_OPS, SET_ATTRIBUTE, REMOVE_ATTRIBUTE, NODE_VALUE } = patches;

    const stats = {
      insert: 0,
      replace: 0,
      remove: 0,
      nodeValue: 0,
      setAttribute: 0,
      removeAttribute: 0,
    };

    TREE_OPS.forEach(patchset => {
      if (patchset.INSERT_BEFORE) {
        stats.insert += patchset.INSERT_BEFORE.length;
      }

      if (patchset.REPLACE_CHILD) {
        stats.replace += patchset.REPLACE_CHILD.length;
      }

      if (patchset.REMOVE_CHILD) {
        stats.remove += patchset.REMOVE_CHILD.length;
      }
    });

    if (NODE_VALUE) {
      stats.nodeValue = NODE_VALUE.length / 2;
    }

    if (SET_ATTRIBUTE) {
      stats.setAttribute = SET_ATTRIBUTE.length / 3;
    }

    if (REMOVE_ATTRIBUTE) {
      stats.removeAttribute = REMOVE_ATTRIBUTE.length / 2;
    }

    this.setState({ stats });
  }

  getColorFromStat = number => {
    let color = '';

    if (number > 100) {
      color = 'red';
    }
    else if (number > 50) {
      color = 'yellow';
    }
    else if (number > 0) {
      color = 'green';
    }

    return color;
  }

  inspectNode = () => {
    const { inspect, transaction: { domNode } } = this.props;
    inspect(domNode);
  }
}

customElements.define('devtools-transaction-row', DevtoolsTransactionRow);
