import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

import { cn } from "../../utils/helpers";

type BaseProps = {
  children: ReactNode;
  className?: string;
  variant?: "solid" | "ghost" | "outline";
};

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: string;
    href?: string;
  };

export function Button({
  children,
  className,
  variant = "solid",
  to,
  href,
  ...rest
}: ButtonProps) {
  const classes = cn("btn", `btn--${variant}`, className);

  if (to) {
    return (
      <Link className={classes} to={to}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

