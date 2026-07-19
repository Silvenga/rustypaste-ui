import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
  className?: string;
  children: ReactNode;
};

function isExternal(href?: string): boolean {
  return !!href && /^https?:\/\//i.test(href);
}

export function Link({ className, href, rel, target, children, ...props }: LinkProps) {
  const external = isExternal(href);
  const computedTarget = target ?? (external ? "_blank" : undefined);
  const computedRel = rel ?? (external ? "noopener noreferrer" : undefined);

  return (
    <a
      className={cn(
        "text-foreground underline-offset-4 hover:text-primary hover:underline",
        className,
      )}
      href={href}
      rel={computedRel}
      target={computedTarget}
      {...props}
    >
      {children}
    </a>
  );
}
