import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { inertOutside, trapTabKey } from '../../utils/focus.js';
import './Modal.css';

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}) {
  const dialogRef = useRef(null);
  const modalRef = useRef(null);
  const firstFocusRef = useRef(null);
  const prevFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    prevFocusRef.current = document.activeElement;
    const restoreBackground = inertOutside(modalRef.current);
    firstFocusRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
      }
      trapTabKey(e, dialogRef.current);
    };

    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      restoreBackground();
      if (prevFocusRef.current && prevFocusRef.current.focus) {
        prevFocusRef.current.focus();
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? 'modal-desc' : undefined}
    >
      <div className="modal__backdrop" aria-hidden="true" onClick={onClose} />
      <div
        ref={dialogRef}
        className={`modal__panel modal__panel--${size}`}
      >
        <header className="modal__head">
          <div>
            <h2 id="modal-title" className="modal__title">{title}</h2>
            {description && (
              <p id="modal-desc" className="modal__desc">{description}</p>
            )}
          </div>
          <button
            ref={firstFocusRef}
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} strokeWidth={2} aria-hidden="true" />
          </button>
        </header>

        <div className="modal__body">{children}</div>

        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>
  );
}
