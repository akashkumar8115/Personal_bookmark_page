"use client";

import { useEffect, useState } from "react";

export function Header() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize theme from local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      // Apply global styles to body
      body.classList.add('bg-gray-900', 'text-white');
      body.classList.remove('bg-gray-50', 'text-gray-900');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      // Apply global styles to body
      body.classList.add('bg-gray-50', 'text-gray-900');
      body.classList.remove('bg-gray-900', 'text-white');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="py-4 shadow-md bg-white dark:bg-gray-800 transition-colors duration-300 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Personal Bookmark Page</h1>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-6">
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors font-medium">Home</a>
              <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors font-medium">About</a>
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors font-medium">Features</a>
            </nav>
            
            <button 
              onClick={toggleTheme} 
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2 font-medium"
            >
              {theme === 'dark' ? (
                <>
                  <i className="bi bi-sun-fill text-yellow-400" /> Light Mode
                </>
              ) : (
                <>
                  <i className="bi bi-moon-stars-fill text-blue-600" /> Dark Mode
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              {theme === 'dark' ? <i className="bi bi-sun-fill text-yellow-400" /> : <i className="bi bi-moon-stars-fill text-blue-600" />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 dark:text-white text-2xl focus:outline-none"
            >
              <i className={`bi ${isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-4 animate-fade-in">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
            <a href="#about" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>About</a>
            <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors font-medium" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
          </div>
        )}
      </div>
    </header>
  );
}