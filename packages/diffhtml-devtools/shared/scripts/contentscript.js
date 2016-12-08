{
  const postMessage = body => chrome.runtime.sendMessage(body);
  const receiveMessages = fn => chrome.runtime.onMessage.addListener(fn);

  const script = document.createElement('script');
  script.src = chrome.extension.getURL('/scripts/injector.js');

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementsByTagName('body')[0].appendChild(script);
  });

  document.addEventListener('diffHTML:activated', ev => {
    postMessage(JSON.parse(ev.detail));
  });

  document.addEventListener('diffHTML:start', ev => {
    console.log('Content Script :: Start transaction');
    postMessage(JSON.parse(ev.detail));
  });

  document.addEventListener('diffHTML:end', ev => {
    postMessage(JSON.parse(ev.detail));
  });
}
