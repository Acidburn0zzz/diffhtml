(function(window) {
  'use strict';

  const pollForFunction = () => new Promise(resolve => {
    if (window.__diffHTMLDevTools) {
      console.log('Found devtools...');
      resolve(window.__diffHTMLDevTools);
    }
    else {
      // Polling interval that looks for the diffHTML devtools hook.
      let interval = setInterval(() => {
        console.log('Checking for devtools...');

        if (window.__diffHTMLDevTools) {
          console.log('Found devtools!');
          resolve(window.__diffHTMLDevTools);
          clearInterval(interval);
        }
      }, 1000);
    }
  });

  const cacheTask = [];

  function devTools() {
    let extension = null;

    const poller = pollForFunction().then(devToolsExtension => {
      extension = devToolsExtension().activate();

      if (cacheTask.length) {
        cacheTask.forEach(cb => cb());
        cacheTask.length = 0;
      }
    });

    return transaction => {
      const {
        domNode,
        markup,
        options,
        state: { oldTree, newTree },
        state,
      } = transaction;

      const start = () => extension.startTransaction(Date.now(), {
        domNode, markup, options, oldTree, newTree, state, aborted: transaction.aborted
      });

      if (!extension) { cacheTask.push(start); } else { start(); }

      // Triggered just before the transaction completes.
      return () => {
        const { patches, promises } = transaction;

        transaction.onceEnded(() => {
          const stop = () => extension.endTransaction(Date.now(), {
            patches,
            promises,
            aborted: transaction.aborted,
          });

          if (!extension) {
            cacheTask.push(stop);
          }
          else {
            stop();
          }
        });
      };
    };
  }

  if (typeof module === 'object') {
    module.exports = devTools;
  }

  window.devTools = devTools;
})(window);
