import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
        heroPrimary:
          "bg-foreground text-background hover:bg-foreground/90 shadow-lg",
        heroSecondary:
          "liquid-glass text-foreground hover:bg-white/[0.04] transition-colors",
        outline:
          "border border-border bg-transparent hover:bg-white/[0.03] text-foreground",
        ghost: "hover:bg-white/[0.04] text-foreground/90",
        success:
          "bg-success text-white hover:bg-success/90 shadow-lg shadow-success/20",
        danger:
          "border border-danger/40 bg-danger/10 text-danger hover:bg-danger/20",
        subtle: "bg-muted text-foreground hover:bg-muted/70",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-full px-8 text-base",
        icon: "h-10 w-10",
        pill: "rounded-full px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
