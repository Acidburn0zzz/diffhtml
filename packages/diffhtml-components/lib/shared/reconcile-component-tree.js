import renderComponent from './render-component';

export default (oldComponentTree = null, markup = null, newTree = null, context = {}) => {
  if (!markup) {
    return { oldComponentTree: markup, newTree };
  }

  if (typeof markup.rawNodeName === 'function') {
    // A new component is being added.
    if (!oldComponentTree) {
      newTree = renderComponent(markup, context);
    }
    // Re-render the existing component.
    else if (oldComponentTree.rawNodeName === markup.rawNodeName) {
      newTree = renderComponent(markup, context);
    }
    // Remove this component.
    else {
      // TODO Handle replace operation.
    }

    oldComponentTree = markup;
    markup.childNodes = [].concat(newTree);
  }

  //for (let i = 0; i < oldComponentTree.childNodes.length; i++) {
  //  console.log(oldComponentTree.childNodes[i]);
  //}

  // `oldComponentTree` is the tree that will be saved back to the transaction
  // state object. While named "old" it is technically the active component
  // tree as one would see in the devtools.
  return { oldComponentTree, newTree };
};
