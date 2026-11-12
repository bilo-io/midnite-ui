import type { AccessibilityState } from 'react-native';

// React Native reads `accessibilityState` / `accessibilityValue`; react-native-web
// 0.21 reads neither, only the `aria-*` props (which RN ≥ 0.71 also reads, and
// merges over the object). These helpers emit both, so a switch is
// aria-checked in the showcase and `checked` to VoiceOver/TalkBack.

export function a11yState(state: AccessibilityState) {
  return {
    accessibilityState: state,
    'aria-busy': state.busy,
    'aria-checked': state.checked,
    'aria-disabled': state.disabled,
    'aria-expanded': state.expanded,
    'aria-selected': state.selected,
  };
}

export function a11yValue(value: { min: number; max: number; now: number; text?: string }) {
  return {
    accessibilityValue: value,
    'aria-valuemin': value.min,
    'aria-valuemax': value.max,
    'aria-valuenow': value.now,
    'aria-valuetext': value.text,
  };
}
