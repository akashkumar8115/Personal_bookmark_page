// "use client";

// import React, { useEffect, useState } from 'react';
// import { Header } from '@/components/Header';
// import { Footer } from '@/components/Footer';
// import { ClockCard } from '@/components/ClockCard';
// import { WeatherCard } from '@/components/WeatherCard';
// import { FavouriteSites } from '@/components/FavouriteSites';
// import { TodoList } from '@/components/TodoList';

// export default function Home() {
//   const [theme, setTheme] = useState<'light' | 'dark'>('light');
//   const [bgImage, setBgImage] = useState('');
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     // User ID Init
//     let storedUserId = localStorage.getItem('user_id');
//     if (!storedUserId) {
//       storedUserId = crypto.randomUUID();
//       localStorage.setItem('user_id', storedUserId);
//     }
//     setUserId(storedUserId);

//     // Theme Init
//     const savedTheme = (localStorage.getItem('theme') || 'light') as 'light' | 'dark';
//     setTheme(savedTheme);
//     document.documentElement.setAttribute('data-theme', savedTheme);

//     // Background Image Init
//     const width = window.screen.width - 1;
//     const height = window.screen.height - 1;
//     const unsplashUrl = `https://source.unsplash.com/collection/158642/${width}x${height}`;
//     const fallbackUrl = `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1920&q=80`;

//     setBgImage(`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${unsplashUrl}), url(${fallbackUrl})`);

//     // Notification Permission
//     if ('Notification' in window && Notification.permission !== 'granted') {
//       Notification.requestPermission();
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = theme === 'dark' ? 'light' : 'dark';
//     setTheme(newTheme);
//     localStorage.setItem('theme', newTheme);
//     document.documentElement.setAttribute('data-theme', newTheme);
//   };

//   return (
//     <div
//       className="min-h-screen flex flex-col"
//       style={{
//         backgroundImage: bgImage,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundAttachment: 'fixed'
//       }}
//     >
//       <Header theme={theme} toggleTheme={toggleTheme} />

//       <main className="container mx-auto px-4 py-8 flex-grow">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//           <ClockCard />
//           <WeatherCard />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {userId && <FavouriteSites userId={userId} />}
//           {userId && <TodoList userId={userId} />}
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }


import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TodoList } from "@/components/TodoList";
import { FavouriteSites } from "@/components/FavouriteSites";
import { WeatherCard } from "@/components/WeatherCard";
import { ClockCard } from "@/components/ClockCard";

export default function Home() {
  // In a real app with authentication, you would get the userId from the session.
  // For now, we use a static ID to store your data.
  const userId = "user-1";

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Top Widgets Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="w-full">
            <ClockCard />
          </div>
          <div className="w-full">
            <WeatherCard />
          </div>
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-full min-h-96">
            <FavouriteSites userId={userId} />
          </div>
          <div className="h-full min-h-96">
            <TodoList userId={userId} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
