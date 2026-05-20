'use client';
import { useEffect, useState } from 'react';

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export function LiveClock({ className }: { className?: string }) {
  const [time, setTime] = useState<string>('--:--:--');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(`${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <time className={className} suppressHydrationWarning>
      UTC {time}
    </time>
  );
}
