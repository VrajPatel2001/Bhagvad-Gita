import { createElement } from 'react';
import type { HTMLAttributes } from 'react';
import { classNames } from '../../lib/classNames';

type TypographyVariant =
  | 'display'
  | 'headline'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'detail'
  | 'eyebrow'
  | 'label';

type TypographyElement =
  | 'p'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'span'
  | 'div';

const defaultElementMap: Record<TypographyVariant, TypographyElement> = {
  display: 'h1',
  headline: 'h2',
  title: 'h2',
  subtitle: 'h3',
  body: 'p',
  detail: 'p',
  eyebrow: 'span',
  label: 'span',
};

export interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: TypographyElement;
  weight?: 'regular' | 'medium' | 'semibold';
}

export function Typography({
  variant = 'body',
  as,
  weight = 'regular',
  className,
  ...rest
}: TypographyProps) {
  const element = as ?? defaultElementMap[variant] ?? 'p';
  const classes = classNames(
    'type',
    `type--${variant}`,
    `type--${weight}`,
    className
  );

  return createElement(element, { className: classes, ...rest });
}
