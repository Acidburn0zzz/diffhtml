import process from './util/process';
import PropTypes from 'prop-types';
import { outerHTML, Internals } from 'diffhtml';
import upgradeSharedClass from './shared/upgrade-shared-class';
import { ComponentTreeCache } from './util/caches';
import { $$render, $$vTree } from './util/symbols';

const { createNode } = Internals;
const { keys, assign } = Object;

class Component {
  [$$vTree] = null;

  [$$render]() {
    const vTree = this[$$vTree];
    const domNode = createNode(vTree);
    const renderTree = this.render();

    const prevProps = this.props;
    const prevState = this.state;

    outerHTML(domNode, renderTree).then(() => {
      this.componentDidUpdate(prevProps, prevState);
    });
  }

  constructor(initialProps, initialContext) {
    initialProps && (initialProps.refs || (initialProps.refs = {}));

    const props = this.props = assign({}, initialProps);
    const state = this.state = {};
    const context = this.context = assign({}, initialContext);

    if (props.refs) {
      this.refs = props.refs;
    }

    const {
      defaultProps = {},
      propTypes = {},
      childContextTypes = {},
      contextTypes = {},
      name,
    } = this.constructor;

    keys(defaultProps).forEach(prop => {
      if (prop in props && props[prop] !== undefined) {
        return;
      }

      this.props[prop] = defaultProps[prop];
    });

    if (process.env.NODE_ENV !== 'production') {
      if (PropTypes.checkPropTypes) {
        PropTypes.checkPropTypes(propTypes, props, 'prop', name);
        PropTypes.checkPropTypes(contextTypes, context, 'context', name);
      }
    }
  }
}

// Wrap this base class with shared methods.
const upgradedClass = upgradeSharedClass(Component);

// Automatically subscribe the React Component middleware.
upgradedClass.subscribeMiddleware();

export default upgradedClass;
