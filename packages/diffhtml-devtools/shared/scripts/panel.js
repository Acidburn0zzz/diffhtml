const { release, innerHTML, html, use } = diff;
const background = chrome.runtime.connect({ name: 'devtools-page' });

// Chrome extensions don't allow inline event handlers, so this middleware
// makes it easy to leverage event delegation instead.
//use(logger());
use(syntheticEvents());

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
const version = '1.0.0';

const render = () => {
  innerHTML(document.body, html`
    <devtools-split-view>
      <devtools-navigation></devtools-navigation>

      <devtools-panels>
        <devtools-transactions-panel
          inProgress=${state.inProgress}
          completed=${state.completed}
        />
      </devtools-panels>

    </devtools-split-view>

    <devtools-header>Detected diffHTML version: ${version}</devtools-header>
  `);
};

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
      // Merge transaction data.
      const transaction = state.inProgress.shift();
      Object.assign(transaction.args, message.data.args);
      state.completed = state.completed.concat(transaction);
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
