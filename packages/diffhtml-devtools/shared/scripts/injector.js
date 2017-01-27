// This file gets loaded into the browser where the application is running. It
// provides the bridge into the extension.
const triggerEvent = (action, data) => {
  const evt = new CustomEvent(`diffHTML:${action}`, {
    detail: JSON.stringify({ action, data })
  });

  document.dispatchEvent(evt);
};

// A global hook for the devtools which is picked up by the application.
window.__diffHTMLDevTools = () => {
  const state = {
    activate(args={}) {
      triggerEvent('activated', args);
      return state;
    },

    startTransaction(startDate, args={}) {
      triggerEvent('start', { startDate, args });
      return state;
    },

    endTransaction(endDate, args={}) {
      triggerEvent('end', { endDate, args });
      return state;
    },
  };

  return state;
};
