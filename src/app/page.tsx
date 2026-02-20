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
    <div 
      className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors duration-300 selection:bg-emerald-500/30 selection:text-emerald-200"
      style={{
        backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}
    >
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
