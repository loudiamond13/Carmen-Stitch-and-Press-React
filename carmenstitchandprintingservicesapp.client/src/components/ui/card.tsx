import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils"; // Adjust path to your utils

const cardVariants = cva(
    "rounded-xl border bg-card text-card-foreground shadow-sm transition-all",
    {
        variants: {
            variant: {
                default: "bg-white dark:bg-zinc-950 border-border",
                glass: "bg-white/70 backdrop-blur-md border-white/20 shadow-lg",
                ghost: "border-none shadow-none bg-transparent",
            },
            padding: {
                none: "p-0",
                sm: "p-4",
                md: "p-6",
                lg: "p-8",
            },
        },
        defaultVariants: {
            variant: "default",
            padding: "md",
        },
    }
);

interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> { }

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, padding, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ variant, padding, className }))}
            {...props}
        />
    )
);
Card.displayName = "Card";

// Sub-components for better organization
const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-1.5 mb-4", className)} {...props} />
);

const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={cn("font-semibold leading-none tracking-tight text-lg", className)} {...props} />
);

const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("", className)} {...props} />
);

export { Card, CardHeader, CardTitle, CardContent };