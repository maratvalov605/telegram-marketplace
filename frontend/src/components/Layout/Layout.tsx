import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      <main className="pb-20 pt-16"> {/* Отступы для header и bottom nav */}
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;