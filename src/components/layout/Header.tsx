import React from 'react';
import {
  Search, Bell, Moon, Sun, Plus, Menu
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface HeaderProps {
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Header({ setIsMobileMenuOpen }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-[#0c0c0e]/80 backdrop-blur-xl border-b border-zinc-200 dark:border-white/[0.05] transition-colors duration-500 flex-none">
      <div className="px-4 sm:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2.5 bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-white/[0.08] rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative max-w-sm w-full hidden md:block group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-zinc-600 dark:group-focus-within:text-zinc-300 transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search components..."
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-100/50 hover:bg-zinc-100 dark:bg-[#111113] dark:hover:bg-[#16161a] border border-transparent rounded-full text-sm focus:outline-none focus:bg-white dark:focus:bg-[#111113] focus:ring-2 focus:ring-zinc-200 dark:focus:ring-white/10 transition-all duration-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition-all duration-300 active:scale-95"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2.5 rounded-full border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-white/[0.05] transition-all duration-300 active:scale-95 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-3 w-1.5 h-1.5 bg-cyan-500 rounded-full" />
            </button>
          </div>

          <button className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-full text-sm font-semibold border border-transparent hover:opacity-90 transition-all duration-300 active:scale-[0.98]">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Create New</span>
          </button>
        </div>
      </div>
    </header>
  );
}
