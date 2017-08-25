import { ok, equal, throws, doesNotThrow } from 'assert';
import { innerHTML, html, use, release, Internals } from 'diffhtml';
import PropTypes from 'prop-types';
import Component from '../lib/component';
import validateCaches from './util/validate-caches';

const { process } = Internals;

describe.only('React Lite Component', function() {
  beforeEach(() => {
    this.fixture = document.createElement('div');
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    release(this.fixture);
    validateCaches();
  });

  it('can render a component', () => {
    class CustomComponent extends Component {
      render() {
        return html`
          <div>Hello world</div>
        `;
      }
    }

    innerHTML(this.fixture, html`<${CustomComponent} />`);

    equal(this.fixture.outerHTML, '<div><div>Hello world</div></div>');
  });

  it('can return multiple elements', () => {
    class CustomComponent extends Component {
      render() {
        return html`
          <div>Hello world</div>
          <p>Test</p>
        `;
      }
    }

    innerHTML(this.fixture, html`<${CustomComponent} />`);

    equal(this.fixture.outerHTML, '<div><div>Hello world</div>\n          <p>Test</p></div>');
  });

  it.only('can have a component return a component aka HoC', () => {
    class CustomComponent extends Component {
      render() {
        return message;
      }
    }

    const embolden = WrappedComponent => class EmboldenComponent {
      render() {
        return html`
          <b><${WrappedComponent} message="Hello world" /></b>
        `;
      }
    };

    const BoldCustomComponent = embolden(CustomComponent);

    innerHTML(this.fixture, html`<${BoldCustomComponent} />`);

    equal(this.fixture.outerHTML, '<b>Hello world</b>');
  });

  describe('Lifecycle', () => {
    it('can map to shouldComponentUpdate', () => {
      let wasCalled = false;

      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor(props) {
          super(props);
          this.state.message = 'default'
        }

        shouldComponentUpdate() {
          wasCalled = true;
          return false;
        }
      }

      let ref = null;
      innerHTML(this.fixture, html`<${CustomComponent} ref=${node => (ref = node)} />`);
      console.log(ref);

      equal(this.fixture.innerHTML, 'default');
      ref.setState({ message: 'something' });
      equal(this.fixture.innerHTML, 'default');
      ok(wasCalled);
    });

    it('can map to componentWillReceiveProps', () => {
      let wasCalled = false;

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }

        componentWillReceiveProps() {
          wasCalled = true;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} someProp="true" />`);
      innerHTML(this.fixture, html`<${CustomComponent} someProp="false" />`);

      ok(wasCalled);
    });

    it('can map to componentDidMount', () => {
      let wasCalled = false;

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }

        componentDidMount() {
          wasCalled = true;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} someProp="true" />`);

      ok(wasCalled);
    });

    it('can map to componentDidUpdate', () => {
      let wasCalled = false;

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }

        componentDidUpdate() {
          wasCalled = true;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} someProp="true" />`);
      innerHTML(this.fixture, html`<${CustomComponent} someProp="false" />`);

      ok(wasCalled);
    });

    it('can map to componentWillUnmount', () => {
      let wasCalled = false;

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }

        componentWillUnmount() {
          wasCalled = true;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} someProp="true" />`);
      innerHTML(this.fixture, html``);

      ok(wasCalled);
    });
  });

  describe('Props', () => {
    it('can set simple string', () => {
      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      const vTree = html`<${CustomComponent} test="true" />`;

      equal(vTree.attributes.test, 'true');
    });

    it('can set complex object', () => {
      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      const ref = {};
      const vTree = html`<${CustomComponent} test=${ref} />`;

      equal(vTree.attributes.test, ref);
    });

    it('can warn if missing proptypes in development', () => {
      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      CustomComponent.propTypes = {
        customProperty: PropTypes.string.isRequired,
      };

      const oldConsoleError = console.error;

      let logCalled = false;
      console.error = () => logCalled = true;

      innerHTML(this.fixture, html`<${CustomComponent} />`);
      console.error = oldConsoleError;
      ok(logCalled);
    });

    it('cannot throw if missing proptypes in production', () => {
      process.env.NODE_ENV = 'production';

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }
      }

      CustomComponent.propTypes = {
        customProperty: PropTypes.string.isRequired,
      };

      doesNotThrow(() => innerHTML(this.fixture, html`<${CustomComponent} />`));
    });

  });

  describe('Refs', () => {
    it('can invoke a ref attribute on a Component', () => {
      let refNode = null;

      class CustomComponent extends Component {
        render() {
          return html`<div ref=${node => (refNode = node)}/>`;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent}
        ref=${node => (refNode = node)}
      />`);

      ok(refNode);
    });

    it('can invoke a ref attribute on a DOM Node', () => {
      let refNode = null;

      class CustomComponent extends Component {
        render() {
          return html`<div>
            <div ref=${node => (refNode = node)} />
          </div>`;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} />`);
      ok(refNode);
      equal(this.fixture.nodeName, 'DIV');
    });
  });

  describe('State', () => {
    it('will always be an object', () => {
      let state = null;

      class CustomComponent extends Component {
        render() {
          return html`<div />`;
        }

        constructor() {
          super();
          state = this.state;
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} />`);
      equal(typeof state, 'object');
    });

    it('can set state in constructor', () => {
      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor() {
          super();
          this.state.message = 'default'
        }
      }

      innerHTML(this.fixture, html`<${CustomComponent} />`);
      equal(this.fixture.innerHTML, 'default');
    });

    it('can call setState to re-render the component', () => {
      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor(props) {
          super(props);
          this.state.message = 'default'
        }
      }

      let ref = null;

      innerHTML(this.fixture, html`<${CustomComponent} ref=${node => (ref = node)} />`);

      equal(this.fixture.innerHTML, 'default');
      ref.setState({ message: 'something' });
      equal(this.fixture.innerHTML, 'something');
    });
  });

  describe('forceUpdate', () => {
    it('can set state manually and call forceUpdate', () => {
      class CustomComponent extends Component {
        render() {
          const { message } = this.state;
          return html`${message}`;
        }

        constructor(props) {
          super(props);
          this.state.message = 'default'
        }
      }

      let ref = null;

      innerHTML(this.fixture, html`<${CustomComponent} ref=${node => (ref = node)} />`);

      equal(this.fixture.innerHTML, 'default');
      ref.state.message = 'something';
      ref.forceUpdate();
      equal(this.fixture.innerHTML, 'something');
    });
  });

  describe('Context', () => {
    it('can inherit context from a parent component', () => {
      class ChildComponent extends Component {
        render() {
          return html`${this.context.message}`;
        }
      }

      class ParentComponent extends Component {
        render() {
          return html`<${ChildComponent} />`;
        }

        getChildContext() {
          return {
            message: 'From Context'
          };
        }
      }

      innerHTML(this.fixture, html`<${ParentComponent} />`);

      equal(this.fixture.innerHTML, 'From Context');
    });
  });

  describe('HOC', () => {
    it('can support a component that returns a new component', () => {
      let didMount = 0;

      class CustomComponent extends Component {
        render() {
          return html`<span>Hello world</span>`;
        }
      }

      const HOC = ChildComponent => class HOCComponent extends Component {
        render() {
          return html`<${ChildComponent} />`;
        }

        componentDidMount() {
          didMount++;
        }
      };

      const WrappedComponent = HOC(CustomComponent);
      innerHTML(this.fixture, html`<${WrappedComponent} />`);

      equal(didMount, 1);
      equal(this.fixture.innerHTML, '<span>Hello world</span>');
    });

  });
});
