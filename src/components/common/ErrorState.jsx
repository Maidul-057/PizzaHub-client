import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorState({ message = "Something went wrong", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center">
      <AlertTriangle className="mb-3 size-9 text-destructive" />
      <p className="font-medium">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
