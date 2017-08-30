import { ComponentTreeCache, InstanceCache } from '../../util/caches';
import { releaseHook } from '../hooks';

export default vTree => {
  const componentTree = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(componentTree);

  // Ensure this is a stateful component. Stateless components do not get
  // lifecycle events yet.
  if (instance && instance.componentWillUnmount) {
    instance.componentWillUnmount();
  }

  ComponentTreeCache.delete(vTree);
  InstanceCache.delete(componentTree);
}
