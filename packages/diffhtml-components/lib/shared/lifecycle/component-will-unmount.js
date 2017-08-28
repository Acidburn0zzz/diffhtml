import { ComponentTreeCache, InstanceCache } from '../../util/caches';

export default vTree => {
  const component = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(component);

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  if (instance && instance.componentWillUnmount) {
    instance.componentWillUnmount();
  }
}
