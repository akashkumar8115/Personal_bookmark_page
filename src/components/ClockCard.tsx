"use client";

import { useEffect, useState } from 'react';

export function ClockCard() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [blink, setBlink] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    // Tells Next.js the component has mounted on the client
    setMounted(true);

    let timeoutId: NodeJS.Timeout;

    const updateClock = () => {
      const now = new Date();
      
      setTime(now.toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
      }));

      // Safely construct the date string instead of using .replace()
      const day = now.getDate();
      const month = now.toLocaleDateString('en-US', { month: 'long' });
      const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
      const year = now.getFullYear();

      const suffix = (d: number) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
          case 1: return 'st';
          case 2: return 'nd';
          case 3: return 'rd';
          default: return 'th';
        }
      };
      
      setDate(`${weekday}, ${month} ${day}${suffix(day)}, ${year}`);
      
      setBlink(true);
      timeoutId = setTimeout(() => setBlink(false), 200);
    };

    updateClock(); // Initial call
    const intervalId = setInterval(updateClock, 1000);

    // Cleanup both the interval and the timeout to prevent memory leaks
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);

  // Prevent hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-full">
        {/* Tailwind Glassmorphism effect */}
        <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-8 rounded-xl shadow-lg text-center w-full max-w-sm">
           <h3 className="text-3xl font-semibold mb-2 opacity-50">Loading clock...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-full">
      {/* Tailwind Glassmorphism effect replacing custom 'glass-card' */}
      <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-8 rounded-xl shadow-lg text-center w-full max-w-sm transition-colors">
        <h3 className={`text-3xl font-semibold mb-2 transition-opacity duration-200 ${blink ? 'opacity-50' : 'opacity-100'}`}>
          {time}
        </h3>
        <h5 className="text-lg opacity-80 text-gray-800 dark:text-gray-200">{date}</h5>
      </div>
    </div>
  );
}