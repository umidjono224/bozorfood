import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({ children, className, noPadding = false }: PageContainerProps) {
  return (
    <main 
      className={cn(
        "min-h-screen bg-background",
        !noPadding && "px-4 py-6",
        className
      )}
    >
      {children}
    </main>
  );
}
