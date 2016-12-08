const { release, outerHTML, html } = diff;
const background = chrome.runtime.connect({ name: 'devtools-page' });

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

const { assign } = Object;
const reactiveBinding = f => ({ set(t, p, v) { t[p] = v; f(); return !0; } });
const state = new Proxy(initialState, reactiveBinding(() => render()));

const render = () => outerHTML(document.body, html`
  <body>
    <h1>diffHTML Found and Activated</h1>

    <devtools-panel>
      <div class="completed_transactions">
        ${state.completed.map((transaction, i) => html`
          <div>Completed transaction ${i + 1}</div>
        `)}
      </div>

      <div class="in_progress_transactions">
        ${state.inProgress.map((transaction, i) => html`
          <div>In Progress transaction ${i + 1}</div>
        `)}
      </div>
    </devtools-panel>
  </body>
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
      state.completed = state.completed.concat(state.inProgress.shift());
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
