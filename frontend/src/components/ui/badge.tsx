import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-white",
        outline: "text-foreground",
        emerald: "border-transparent bg-emerald-100 text-emerald-800",
        pending: "border-transparent bg-amber-100 text-amber-800",
        assigned: "border-transparent bg-blue-100 text-blue-800",
        in_transit: "border-transparent bg-purple-100 text-purple-800",
        delivered: "border-transparent bg-emerald-100 text-emerald-800",
        cancelled: "border-transparent bg-red-100 text-red-800",
        picked_up: "border-transparent bg-cyan-100 text-cyan-800",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
