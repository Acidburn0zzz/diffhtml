import { InstanceCache, ComponentTreeCache } from '../util/caches';

export default vTree => {
  const root = ComponentTreeCache.get(vTree);
  const instance = InstanceCache.get(root);

  ComponentTreeCache.delete(vTree);
  InstanceCache.delete(root);
};
