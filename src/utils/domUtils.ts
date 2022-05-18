export const FOCUSABLE_ELEMENTS = [
  'input:not([disabled])',
  'select:not([disabled])',
  'button:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getFocusableElements($element: HTMLElement | ShadowRoot | null | undefined) {
  return Array.prototype.slice.call(
    $element?.querySelectorAll(FOCUSABLE_ELEMENTS)
  );
}

export const keys = {
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  Enter: 'Enter',
  Escape: 'Escape',
  Shift: 'Shift',
  Space: ' ',
  Tab: 'Tab',
}
