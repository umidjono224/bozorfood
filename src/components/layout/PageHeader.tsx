import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  showHome?: boolean;
}

export function PageHeader({ title, showBack = true, showHome = true }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border safe-top">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {!showBack && <div className="w-10" />}
        </div>
        
        <h1 className="font-bold text-lg text-foreground">{title}</h1>
        
        <div className="flex items-center gap-2">
          {showHome && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-10 w-10"
            >
              <Home className="h-5 w-5" />
            </Button>
          )}
          {!showHome && <div className="w-10" />}
        </div>
      </div>
    </header>
  );
}
