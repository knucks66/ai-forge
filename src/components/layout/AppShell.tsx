'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@/lib/utils/cn';

export function AppShell({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header />
        <main
          className={cn(
            'flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6',
            'transition-all duration-200'
          )}
        >
          {children}
        </main>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
