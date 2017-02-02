import unique from 'unique-selector';
    window.unique = unique;

function devTools(options = {}) {
  const cacheTask = [];
  const elements = new Set();
  let extension = null;
  let interval = null;

  const pollForFunction = () => new Promise(resolve => {
    if (window.__diffHTMLDevTools) {
      resolve(window.__diffHTMLDevTools);
    }
    else {
      // Polling interval that looks for the diffHTML devtools hook.
      interval = setInterval(() => {
        if (window.__diffHTMLDevTools) {
          resolve(window.__diffHTMLDevTools);
          clearInterval(interval);
        }
      }, 2000);
    }
  });

  function devToolsTask(transaction) {
    const {
      domNode, markup, options, state: { oldTree, newTree }, state
    } = transaction;

    const selector = unique(domNode);

    elements.add(selector);

    const start = () => extension.startTransaction(Date.now(), {
      domNode: selector,
      markup,
      options,
      state,
    });

    if (extension) { start(); }

    return () => transaction.onceEnded(() => {
      const { aborted, patches, promises, completed } = transaction;
      const stop = () => extension.endTransaction(Date.now(), {
        domNode: selector,
        markup,
        options,
        state,
        patches,
        promises,
        completed,
        aborted,
      });

      if (!extension) { cacheTask.push(() => stop()); } else { stop(); }
    });
  }

  devToolsTask.subscribe = ({ VERSION, internals }) => {
    pollForFunction().then(devToolsExtension => {
      const MiddlewareCache = [];

      internals.MiddlewareCache.forEach(middleware => {
        const name = middleware.name
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase())
          .split(' ').slice(0, -1).join(' ');

        MiddlewareCache.push(name);
      });

      extension = devToolsExtension().activate({
        VERSION,
        internals: {
          MiddlewareCache,
        }
      });

      if (cacheTask.length) {
        setTimeout(() => {
          cacheTask.forEach(cb => cb());
          cacheTask.length = 0;
        });
      }
    });
  };

  return devToolsTask;
}

export default devTools;
