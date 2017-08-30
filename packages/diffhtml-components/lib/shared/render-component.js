import { ComponentTreeCache, InstanceCache } from '../util/caches';
import { $$vTree } from '../util/symbols';

export default function renderComponent(vTree, context = {}) {
  const Component = vTree.rawNodeName;
  const props = vTree.attributes;
  const isNewable = Component.prototype && Component.prototype.render;

  let instance = null;

  // Existing class instance.
  if (InstanceCache.has(vTree)) {
    instance = InstanceCache.get(vTree);

    // Wipe out all old references before re-rendering.
    // TODO Find a better way of accomplishing this.
    ComponentTreeCache.forEach((_vTree, childNode) => {
      if (_vTree === vTree) {
        ComponentTreeCache.delete(childNode);
      }
    });
  }
  // New class instance.
  else if (isNewable) {
    instance = new Component(props, context);
    InstanceCache.set(vTree, instance);
    instance[$$vTree] = vTree;
  }

  // Support stateless functions, stateless classes, and stateful classes.
  let renderTree = null;

  if (isNewable) {
    renderTree = instance.render(props, context);
  }
  else {
    renderTree = Component(props, context)
  }

  // Associate the children with the parent component that rendered them, this
  // is used to trigger lifecycle events.
  const linkTrees = childNodes => {
    for (let i = 0; i < childNodes.length; i++) {
      const newTree = childNodes[i];

      if (newTree.nodeType !== 11) {
        ComponentTreeCache.set(newTree, vTree);
      }
      else {
        linkTrees(newTree.childNodes);
      }
    }
  };

  linkTrees([].concat(renderTree));

  return renderTree;
};
