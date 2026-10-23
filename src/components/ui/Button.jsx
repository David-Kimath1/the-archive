import { forwardRef } from 'react';
import './Button.css';

const Button = forwardRef(function Button(
  {
    variant = 'secondary',
    size = 'md',
    icon: Icon,
    children,
    className = '',
    type = 'button',
    ...rest
  },
  ref
) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    !children && 'btn--icon-only',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button ref={ref} type={type} className={classes} {...rest}>
      {Icon && <Icon size={16} strokeWidth={2} aria-hidden="true" />}
      {children && <span>{children}</span>}
    </button>
  );
});

export default Button;
