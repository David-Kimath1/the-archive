const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function getFocusableElements(container) {
  if (!container) return [];
  return [...container.querySelectorAll(FOCUSABLE_SELECTOR)].filter(
    (element) => {
      const style = getComputedStyle(element);
      return (
        !element.hidden &&
        element.getAttribute('aria-hidden') !== 'true' &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        element.getClientRects().length > 0
      );
    },
  );
}

export function trapTabKey(event, container) {
  if (event.key !== 'Tab') return;
  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) {
    event.preventDefault();
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  if (event.shiftKey && (document.activeElement === first || !container.contains(document.activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (document.activeElement === last || !container.contains(document.activeElement))) {
    event.preventDefault();
    first.focus();
  }
}

export function inertOutside(element) {
  const changedElements = [];
  let current = element;

  while (current && current !== document.body) {
    const parent = current.parentElement;
    if (!parent) break;
    for (const sibling of parent.children) {
      if (sibling === current || !(sibling instanceof HTMLElement)) continue;
      changedElements.push([sibling, sibling.inert]);
      sibling.inert = true;
    }
    current = parent;
  }

  return () => {
    changedElements.forEach(([sibling, wasInert]) => {
      if (sibling.isConnected) sibling.inert = wasInert;
    });
  };
}
