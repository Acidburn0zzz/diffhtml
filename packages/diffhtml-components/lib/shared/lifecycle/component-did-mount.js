import { ComponentTreeCache, InstanceCache } from '../../util/caches';

export default newTree => {
  const component = ComponentTreeCache.get(newTree);
  const instance = InstanceCache.get(component);

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  if (instance && instance.componentDidMount) {
    instance.componentDidMount();
  }
}
