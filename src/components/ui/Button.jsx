import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

/* Shared call-to-action button. Renders a router <Link> when given `to`, an <a> when given `href`,
   otherwise <button type="button">. Pass className to add layout classes (margins, width). */
const base =
  'inline-flex items-center justify-center gap-2 border-2 bg-transparent font-mono font-bold text-center cursor-pointer transition-all duration-300 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed aria-disabled:opacity-60';

const variants = {
  primary:
    'border-primary text-primary hover:bg-primary hover:text-surface focus-visible:bg-primary focus-visible:text-surface ' +
    'hover:shadow-[0_0_20px_color-mix(in_oklab,var(--color-primary)_40%,transparent)] focus-visible:shadow-[0_0_20px_color-mix(in_oklab,var(--color-primary)_40%,transparent)]',
  secondary:
    'border-accent text-accent hover:bg-accent hover:text-surface focus-visible:bg-accent focus-visible:text-surface ' +
    'hover:shadow-[0_0_20px_color-mix(in_oklab,var(--color-accent)_40%,transparent)] focus-visible:shadow-[0_0_20px_color-mix(in_oklab,var(--color-accent)_40%,transparent)]',
};

const sizes = {
  md: 'px-8 py-4 text-[16px]',
  sm: 'px-5 py-2.5 text-[14px]',
};

export default function Button({ variant = 'primary', size = 'md', to, href, className, children, ...props }) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (to !== undefined) {
    return <Link to={to} className={classes} {...props}>{children}</Link>;
  }
  if (href !== undefined) {
    return <a href={href} className={classes} {...props}>{children}</a>;
  }
  return <button type="button" className={classes} {...props}>{children}</button>;
}
