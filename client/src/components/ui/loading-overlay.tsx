import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, children }: LoadingOverlayProps) {
  if (isLoading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}