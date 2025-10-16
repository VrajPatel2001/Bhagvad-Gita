import { createElement } from 'react';
import type { HTMLAttributes } from 'react';
import { classNames } from '../../lib/classNames';

type CardElement = 'article' | 'section' | 'div';

type CardTone = 'default' | 'accent' | 'muted';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  tone?: CardTone;
  interactive?: boolean;
}

export function Card({
  as = 'article',
  tone = 'default',
  interactive = false,
  className,
  ...rest
}: CardProps) {
  const classes = classNames(
    'card',
    `card--tone-${tone}`,
    interactive ? 'card--interactive' : undefined,
    className
  );

  return createElement(as, { className: classes, ...rest });
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <header className={classNames('card__header', className)} {...rest} />;
}

export function CardContent({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <div className={classNames('card__content', className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return <footer className={classNames('card__footer', className)} {...rest} />;
}
