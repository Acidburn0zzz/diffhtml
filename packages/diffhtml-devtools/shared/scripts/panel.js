const { release, innerHTML, html, use } = diff;
const background = chrome.runtime.connect({ name: 'devtools-page' });

use(logger());

// Relay the tab ID to the background page
background.postMessage({
  tabId: chrome.devtools.inspectedWindow.tabId,
  scriptToInject: 'scripts/contentscript.js',
  name: 'init',
});

const initialState = {
  inProgress: [],
  completed: [],
};

const reactiveBinding = f => ({ set(t, p, v) { t[p] = v; f(); return !0; } });
const state = new Proxy(initialState, reactiveBinding(() => render()));

const render = () => innerHTML(document.body, html`
  <devtools-split-view>
    <devtools-navigation></devtools-navigation>

    <devtools-panel id="transactions">
      <div>
        <h1>In Progress</h1>

        ${state.inProgress
          .filter(Boolean)
          .map(transaction => html`<devtools-transaction-row
            stateName="inProgress"
            transaction=${transaction}
          />`)}
      </div>

      <div>
        <h1>Completed</h1>

        ${state.completed
          .filter(Boolean)
          .map(transaction => html`<devtools-transaction-row
            stateName="completed"
            transaction=${transaction}
          />`)}
      </div>
    </devtools-panel>

  </devtools-split-view>
`);

background.onMessage.addListener(function(message) {
  switch (message.action) {
    case 'activated': {
      state.inProgress = [];
      state.completed = [];
      break;
    }

    case 'start': {
      state.inProgress = state.inProgress.concat(message.data);
      break;
    }

    case 'end': {
      //state.completed = state.completed.concat(state.inProgress.shift());
      break;
    }
  }
});

document.querySelector('body').onclick = e => {
  if (e.target.matches('.retry')) {
    background.postMessage({
      tabId: chrome.devtools.inspectedWindow.tabId,
      scriptToInject: 'scripts/contentscript.js',
      name: 'init',
    });
  }
};
