const FOCUSABLE_ELEMENTS = [
  "input:not([disabled])",
  "select:not([disabled])",
  'button:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function getFocusableElements($element: HTMLElement | undefined) {
  return Array.prototype.slice.call(
    $element?.querySelectorAll(FOCUSABLE_ELEMENTS)
  );
}
