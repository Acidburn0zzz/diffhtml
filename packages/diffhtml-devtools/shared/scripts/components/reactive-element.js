class ReactiveElement extends HTMLElement {
  constructor() {
    super();

    this.state = {};
  }

  update() {
    setTimeout(() => {
      diff.innerHTML(this.shadow, this.render());
    }, 1000);
  }

  setState(newState) {
    this.state = newState;
    this.shouldComponentUpdate() && this.update();
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    this.update();
    this.componentDidMount();
  }

  disconnectedCallback() { this.componentWillUnmount(); }
  shouldComponentUpdate() { return true; }
  componentDidMount() {}
  componentWillUnmount() {}
}
