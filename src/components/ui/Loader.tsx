
import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const Loader = ({ size = "md", className, text }: LoaderProps) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "rounded-full border-primary border-t-transparent animate-spin",
          sizeClasses[size]
        )}
      />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default Loader;
