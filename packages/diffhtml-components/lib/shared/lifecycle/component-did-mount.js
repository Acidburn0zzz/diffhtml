import { ComponentTreeCache, InstanceCache } from '../../util/caches';

export default vTree => {
  const componentTree = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(componentTree);

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  if (instance && instance.componentDidMount) {
    instance.componentDidMount();
  }
}
