import type { ReactNode } from "react";

import { cn } from "../../utils/helpers";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <article className={cn("card", className)}>{children}</article>;
}

