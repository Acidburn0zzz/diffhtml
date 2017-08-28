import { InstanceCache, ComponentTreeCache } from '../util/caches';
import renderComponent from './render-component';

const root = typeof window !== 'undefined' ? window : global;

export const releaseHook = vTree => {
  const root = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(vTree);

  ComponentTreeCache.delete(vTree);
  InstanceCache.delete(root);
};

export const createNodeHook = vTree => {
  const { customElements } = root;
  const Constructor = customElements.get(vTree.nodeName);

  if (Constructor) {
    vTree.attributes.children = vTree.childNodes;
    return new Constructor(vTree.attributes);
  }
};

export const syncTreeHook = (oldTree, newTree, parentTree) => {
  if (typeof newTree.rawNodeName === 'function') {
    const oldComponentTree = ComponentTreeCache.get(oldTree);

    if (!oldComponentTree) {
      return renderComponent(newTree);
    }
    else if (oldComponentTree.rawNodeName === newTree.rawNodeName) {
      return renderComponent(oldComponentTree);
    }
  }
  else {
    for (let i = 0; i < newTree.childNodes.length; i++) {
      if (typeof newTree.childNodes[i].rawNodeName === 'function') {
        const renderTree = renderComponent(newTree.childNodes[i]);

        if (renderTree && renderTree !== newTree.childNodes[i]) {
          newTree.childNodes[i] = renderTree;
        }
      }
    }
  }
};
