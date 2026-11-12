// @vitest-environment node
import { describe, expect, it } from 'vitest';

import { a11yState, a11yValue } from './a11y';

describe('a11yState / a11yValue', () => {
  it('emits only the keys that are set', () => {
    expect(a11yState({ disabled: false })).toEqual({
      accessibilityState: { disabled: false },
      'aria-disabled': false,
    });
    expect(Object.keys(a11yState({ checked: true, busy: undefined }))).toEqual([
      'accessibilityState',
      'aria-checked',
    ]);
    expect(Object.keys(a11yValue({ min: 0, max: 10, now: 4 }))).toEqual([
      'accessibilityValue',
      'aria-valuemin',
      'aria-valuemax',
      'aria-valuenow',
    ]);
  });

  it('leaves a consumer aria-* prop spread before it in place', () => {
    const props = { 'aria-expanded': true, ...a11yState({ disabled: false, busy: false }) };
    expect(props['aria-expanded']).toBe(true);
  });
});
