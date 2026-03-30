import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Settings, Layers, Clock, LogOut,
  X, HelpCircle, ChevronLeft, ChevronRight, Wand2, ArrowUpRight
} from 'lucide-react';
import { env } from '../../config/env';
import { useUser, getInitials } from '../../contexts/UserContext';

const BrandLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="22" cy="22" r="8" fill="currentColor" fillOpacity="0.2" />
    <rect x="14" y="2" width="16" height="16" rx="6" fill="currentColor" fillOpacity="0.4" />
    <rect x="2" y="14" width="16" height="16" rx="6" fill="currentColor" fillOpacity="0.4" />
    <rect x="2" y="2" width="16" height="16" rx="6" fill="currentColor" />
  </svg>
);

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen, isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Wand2, label: 'Sketch to UI', path: '/sketch' },
    { icon: Layers, label: 'Projects', path: '/projects' },
    { icon: Clock, label: 'Schedule', path: '/schedule' },
    { icon: Settings, label: 'Settings', path: '/profile' },
  ];

  return (
    <aside className={`fixed left-0 top-0 bottom-0 bg-white dark:bg-[#0c0c0e] border-r border-zinc-200 dark:border-white/[0.05] flex flex-col z-[70] transition-all duration-500 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}>
      <div className={`p-6 flex items-center justify-between text-zinc-900 dark:text-zinc-200 mb-2 ${isCollapsed ? 'lg:px-0 lg:justify-center' : ''}`}>
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-zinc-900 dark:bg-zinc-100 dark:text-black text-white flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shrink-0 border border-zinc-800 dark:border-white/10">
            <BrandLogo className="w-5 h-5" />
          </div>
          {!isCollapsed && <span className="text-xl font-extrabold tracking-tighter whitespace-nowrap transition-all duration-500 uppercase"> {env.appName}</span>}
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors duration-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Collapse Toggle - Desktop Only */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-12 w-6 h-6 bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-white/[0.1] items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 z-10"
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="flex-1 px-4 space-y-10 overflow-y-auto py-8 custom-scrollbar overflow-x-hidden">
        <nav className="space-y-1.5">
          {!isCollapsed && <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-6 opacity-80">General</p>}
          {navItems.map((item, i) => {
            const isActive = location.pathname === item.path && (item.path !== '/' || location.pathname === '/');
            return (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-300 group ${isActive ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black border border-zinc-900 dark:border-transparent' : 'text-zinc-500 border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] hover:bg-zinc-50 dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-[0.98]'} ${isCollapsed ? 'justify-center lg:px-0' : ''}`}
              >
                <item.icon className={`w-4 h-4 transition-all duration-300 shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}`} />
                {!isCollapsed && <span className="transition-all duration-500 whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <nav className="space-y-1.5">
          {!isCollapsed && <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 mb-6 opacity-80">Support</p>}
          <button
            title={isCollapsed ? 'Help Center' : ''}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-none text-xs font-bold uppercase tracking-widest text-zinc-500 border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] hover:bg-zinc-50 dark:hover:bg-white/[0.04] hover:text-zinc-900 dark:hover:text-zinc-100 active:scale-[0.98] transition-all duration-300 group ${isCollapsed ? 'justify-center lg:px-0' : ''}`}
          >
            <HelpCircle className="w-4 h-4 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300 shrink-0" />
            {!isCollapsed && <span className="transition-all duration-500 whitespace-nowrap">Help Center</span>}
          </button>
          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Logout' : ''}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-none text-xs font-bold uppercase tracking-widest text-rose-500 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all duration-300 active:scale-[0.98] group ${isCollapsed ? 'justify-center lg:px-0' : ''}`}
          >
            <LogOut className="w-4 h-4 group-hover:scale-110 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
            {!isCollapsed && <span className="transition-all duration-500 whitespace-nowrap">Logout</span>}
          </button>
        </nav>
      </div>

      <div className={`p-6 mt-auto border-t border-zinc-100 dark:border-white/[0.05] ${isCollapsed ? 'lg:p-4 lg:px-2' : ''}`}>
        <button
          onClick={() => navigate('/profile')}
          title={isCollapsed ? `${user?.firstName} ${user?.lastName}` : ''}
          className={`w-full flex items-center gap-3 group p-2 rounded-none border border-transparent hover:border-zinc-200 dark:hover:border-white/[0.1] hover:bg-zinc-50 dark:hover:bg-white/[0.04] transition-all duration-300 active:scale-[0.98] ${isCollapsed ? 'justify-center lg:p-1' : ''}`}
        >
          <div className={`rounded-none overflow-hidden border border-zinc-200 dark:border-white/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 shrink-0 flex items-center justify-center bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black font-black text-xs ${isCollapsed ? 'w-10 h-10' : 'w-10 h-10'}`}>
            {getInitials(user)}
          </div>
          {!isCollapsed && (
            <>
              <div className="text-left flex-1 min-w-0 transition-all duration-500">
                <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 truncate uppercase tracking-tighter">{user?.firstName} {user?.lastName}</p>
                <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 truncate uppercase tracking-widest">{user?.jobTitle}</p>
              </div>
              <div className="w-8 h-8 rounded-none bg-white dark:bg-[#16161a] flex items-center justify-center border border-zinc-100 dark:border-white/[0.1] group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-100 dark:group-hover:text-black transition-all duration-500 shrink-0">
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
