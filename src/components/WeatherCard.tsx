"use client";

import { useEffect, useState } from 'react';

interface WeatherData {
  temp: string;
  desc: string;
  humidity: string;
  pressure: string;
  wind: string;
}

interface WttrResponse {
  current_condition: Array<{
    temp_C: string;
    weatherDesc: Array<{ value: string }>;
    humidity: string;
    pressure: string;
    windspeedKmph: string;
  }>;
}

export function WeatherCard() {
  const [location, setLocation] = useState<string>('Delhi');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 1. Hydration & LocalStorage sync
  useEffect(() => {
    setMounted(true);
    const savedLocation = localStorage.getItem("weather_location");
    if (savedLocation) {
      setLocation(savedLocation);
    }
  }, []);

  // 2. Fetch Weather Data safely
  useEffect(() => {
    // Prevent fetching before localStorage is checked
    if (!mounted) return;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        // Added encodeURIComponent to handle cities with spaces (e.g., "New York")
        const res = await fetch(`https://wttr.in/${encodeURIComponent(location)}?format=j1`);
        if (!res.ok) throw new Error("Network response was not ok");

        const data = (await res.json()) as WttrResponse;
        const current = data.current_condition?.[0];
        if (!current) {
          throw new Error("No weather data available");
        }

        if (!current.weatherDesc || current.weatherDesc.length === 0) {
          throw new Error("No weather description available");
        }

        setWeather({
          temp: `${current.temp_C}°C`,
          desc: current.weatherDesc[0]?.value ?? "",
          humidity: `${current.humidity}%`,
          pressure: `${current.pressure} mB`,
          wind: `${current.windspeedKmph} km/h`
        });
      } catch (err) {
        console.warn("Weather error:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchWeather();
  }, [location, mounted]);

  const handleEditLocation = () => {
    const newLoc = prompt("Enter name of District or City", location);
    if (newLoc && newLoc.trim() !== "") {
      const formattedLoc = newLoc.trim();
      setLocation(formattedLoc);
      localStorage.setItem("weather_location", formattedLoc);
    }
  };

  // Prevent hydration mismatch by rendering a skeleton/loading state first
  if (!mounted) {
    return (
      <div className="flex justify-center h-full w-full">
        <div className="bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg w-full max-w-md animate-pulse">
          <div className="h-32 flex items-center justify-center opacity-50">Loading weather...</div>
        </div>
      </div>
    );
  }

  return (
    <section className="flex justify-center h-full w-full" aria-label="Weather Forecast">
      {/* Replaced 'glass-card' with Tailwind utility classes */}
      <article className="bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-xl shadow-lg w-full max-w-md transition-colors">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h3 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {loading ? '--' : weather?.temp ?? '--'}
            </h3>
            <i className="bi bi-thermometer-sun mx-2 text-3xl text-yellow-500 dark:text-yellow-400" />
          </div>

          <div className="text-right">
            <div className="font-medium text-gray-800 dark:text-gray-200">
              {loading ? 'Loading...' : weather?.desc ?? 'Unavailable'}
            </div>
            <div
              className="flex items-center justify-end gap-2 cursor-pointer text-gray-700 dark:text-gray-300 hover:text-blue-500 transition-colors mt-1"
              onClick={handleEditLocation}
            >
              <span className="font-semibold">{location}</span>
              <i className="bi bi-pencil text-sm opacity-70 hover:opacity-100" />
            </div>
          </div>
        </div>

        <div className="flex justify-around items-center mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
          <div className="text-center">
            <i className="bi bi-droplet-half text-blue-500 dark:text-blue-400 text-xl block mb-1" />
            <span className="text-sm text-gray-800 dark:text-gray-200">{loading ? '--' : weather?.humidity ?? '--'}</span>
          </div>
          <div className="text-center">
            <i className="bi bi-thermometer-half text-orange-500 dark:text-orange-400 text-xl block mb-1" />
            <span className="text-sm text-gray-800 dark:text-gray-200">{loading ? '--' : weather?.pressure ?? '--'}</span>
          </div>
          <div className="text-center">
            <i className="bi bi-wind text-gray-500 dark:text-gray-400 text-xl block mb-1" />
            <span className="text-sm text-gray-800 dark:text-gray-200">{loading ? '--' : weather?.wind ?? '--'}</span>
          </div>
        </div>
      </article>
    </section>
  );
}