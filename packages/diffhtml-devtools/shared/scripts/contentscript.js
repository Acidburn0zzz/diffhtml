'use strict';

/**
 * Allows communication between content script and background script.
 *
 * @param {Object} body - the message payload.
 */
function postMessage(body) {
  chrome.runtime.sendMessage(body);
}

function receiveMessages(fn) {
  chrome.runtime.onMessage.addListener(fn);
}

// Receive all messages from the runtime.
receiveMessages(function(evt) {
  if (evt.action === 'getHtmlSource') {
    postMessage({
      action: 'sendHtmlSource',
      source: document.documentElement.outerHTML
    });
  }
});
