
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  interactive?: boolean;
  hover3D?: boolean;
}

const Card = ({ className, children, interactive = false, hover3D = false }: CardProps) => {
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3D) return;
    
    const card = e.currentTarget;
    const { left, top, width, height } = card.getBoundingClientRect();
    
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    const tiltX = (y - 0.5) * 10; // -5 to 5 degrees tilt
    const tiltY = (0.5 - x) * 10; // -5 to 5 degrees tilt
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: '0.1s ease'
    });
  };

  const handleMouseLeave = () => {
    if (!hover3D) return;
    
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0) rotateY(0)',
      transition: 'transform 0.5s ease'
    });
  };

  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-lg border shadow overflow-hidden",
        interactive && "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        className
      )}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn("p-4 md:p-6 flex flex-col space-y-2", className)}>{children}</div>;
};

export const CardTitle = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <h3 className={cn("text-lg font-semibold", className)}>{children}</h3>;
};

export const CardDescription = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
};

export const CardContent = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn("px-4 md:px-6 py-2", className)}>{children}</div>;
};

export const CardFooter = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return <div className={cn("p-4 md:p-6 flex items-center", className)}>{children}</div>;
};

export default Card;
