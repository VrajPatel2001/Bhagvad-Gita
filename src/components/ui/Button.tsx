import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { classNames } from '../../lib/classNames';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      className,
      type = 'button',
      startIcon,
      endIcon,
      children,
      ...rest
    },
    ref
  ) => {
    const classes = classNames(
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      startIcon ? 'btn--with-start-icon' : undefined,
      endIcon ? 'btn--with-end-icon' : undefined,
      className
    );

    return (
      <button ref={ref} type={type} className={classes} {...rest}>
        {startIcon ? (
          <span aria-hidden="true" className="btn__icon btn__icon--start">
            {startIcon}
          </span>
        ) : null}
        <span className="btn__label">{children}</span>
        {endIcon ? (
          <span aria-hidden="true" className="btn__icon btn__icon--end">
            {endIcon}
          </span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = 'Button';
