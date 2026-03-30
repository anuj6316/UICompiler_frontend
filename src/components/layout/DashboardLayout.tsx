import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  header?: (props: { setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>> }) => React.ReactNode;
}

export function DashboardLayout({ children, header }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen w-full bg-zinc-50 dark:bg-[#111113] text-zinc-900 dark:text-zinc-200 font-sans transition-colors duration-500">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content Area */}
      <main className={`min-h-screen flex flex-col transition-all duration-500 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        
        {/* Render provided header OR fallback to default Header */}
        {header ? header({ setIsMobileMenuOpen }) : <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />}
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto flex flex-col relative w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
