import process from './util/process';
import { createTree, innerHTML, use } from 'diffhtml';
import PropTypes from 'prop-types';
import upgradeSharedClass from './shared/upgrade-shared-class';
import webComponentTask from './tasks/web-component';
import { $$render } from './util/symbols';

const Debounce = new WeakMap();
const { setPrototypeOf, assign, keys } = Object;

// Convert observed attributes from passed PropTypes.
const getObserved = ({ propTypes }) => propTypes ? keys(propTypes) : [];

// Creates the `component.props` object.
const createProps = (domNode, props = {}) => {
  const observedAttributes = getObserved(domNode.constructor);
  const initialProps = {
    children: [].map.call(domNode.childNodes, createTree),
  };

  const incoming = observedAttributes.reduce((props, attr) => assign(props, {
    [attr]: attr in domNode ? domNode[attr] : domNode.getAttribute(attr) || initialProps[attr],
  }), initialProps);

  return Object.assign({}, props, incoming);
};

// Creates the `component.state` object.
const createState = (domNode, newState) => assign({}, domNode.state, newState);

// Creates the `component.contxt` object.
const createContext = (domNode, context) => {
  /* */
  return context;
};

// Allow tests to unbind this task, you would not typically need to do this
// in a web application, as this code loads once and is not reloaded.
const subscribeMiddleware = () => use(webComponentTask);

let unsubscribeMiddleware = subscribeMiddleware();

export default upgradeSharedClass(class WebComponent extends HTMLElement {
  static subscribeMiddleware() {
    return unsubscribeMiddleware = subscribeMiddleware();
  }

  static unsubscribeMiddleware() {
    unsubscribeMiddleware();
    return subscribeMiddleware;
  }

  static get observedAttributes() {
    return getObserved(this).map(key => key.toLowerCase());
  }

  [$$render]() {
    this.props = createProps(this, this.props);

    const promise = innerHTML(this.shadowRoot, this.render(this.props, this.state));

    return promise.then(transaction => {
      this.componentDidUpdate();
    });
  }

  constructor(props, context) {
    super();

    this.props = createProps(this, props);
    this.state = createState(this);
    this.context = createContext(this);

    const {
      defaultProps = {},
      propTypes = {},
      childContextTypes = {},
      contextTypes = {},
      name,
    } = this.constructor;

    keys(defaultProps).forEach(prop => {
      if (prop in this.props && this.props[prop] !== undefined) {
        return;
      }

      this.props[prop] = defaultProps[prop];
    });

    if (process.env.NODE_ENV !== 'production') {
      if (PropTypes.checkPropTypes) {
        PropTypes.checkPropTypes(propTypes, this.props, 'prop', name);
      }
    }
  }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    this[$$render]();
    this.componentDidMount();
  }

  disconnectedCallback() {
    // TODO Figure out a better place for `willUnmount`, use the detached
    // transition to determine if a Node is removed would be very accurate
    // as this fires just before an element is removed, also if the user
    // is using a detached animation this would allow them to do something
    // before the animation completes, giving you two nice callbacks to use
    // for detaching.
    this.componentWillUnmount();
    this.componentDidUnmount();
  }

  attributeChangedCallback(name, value) {
    if (!Debounce.has(this) && value !== null) {
      const nextProps = createProps(this, this.props);
      const nextState = this.state;

      this.componentWillReceiveProps(nextProps);

      if (this.shouldComponentUpdate(nextProps, nextState)) {
        this[$$render]();
      }
    }
  }
});
