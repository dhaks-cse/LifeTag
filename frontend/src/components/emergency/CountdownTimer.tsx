import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Expired";
  const totalMinutes = Math.floor(ms / 60000);
  if (totalMinutes < 1) {
    const seconds = Math.floor(ms / 1000);
    return `${seconds} sec remaining`;
  }
  return `${totalMinutes} min remaining`;
}

interface CountdownTimerProps {
  expiresAt: string;
}

function CountdownTimer({ expiresAt }: CountdownTimerProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const remainingMs = new Date(expiresAt).getTime() - now;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
      <Timer className="h-3.5 w-3.5 text-blue-600" />
      {formatRemaining(remainingMs)}
    </span>
  );
}

export default CountdownTimer;
