import assert from 'assert';
import {
  ComponentTreeCache,
  InstanceCache,
  ChildParentCache,
} from '../../lib/util/caches';

/**
 * Validates that the caches has been successfully cleaned per render.
 */
export default function validateCaches() {
  assert.equal(ComponentTreeCache.size, 0, 'The ComponentTree cache should be empty');
  assert.equal(InstanceCache.size, 0, 'The instance cache should be empty');
  assert.equal(ChildParentCache.size, 0, 'The ChildParent cache should be empty');
}
