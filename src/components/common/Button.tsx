
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "pokemon";
  size?: "sm" | "md" | "lg" | "icon";
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "default", 
    size = "md", 
    children, 
    loading = false, 
    fullWidth = false,
    icon,
    ...props 
  }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      pokemon: "bg-pokemon-red text-white shadow hover:bg-pokemon-red/90",
    };

    const sizes = {
      sm: "h-8 rounded-md px-3 text-xs",
      md: "h-10 rounded-md px-4 py-2",
      lg: "h-12 rounded-md px-6 text-lg",
      icon: "h-10 w-10 rounded-md flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
        ) : icon ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
