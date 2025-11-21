import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, CalendarRange, BarChart3, Menu, X } from 'lucide-react';

const SidebarItem = ({ to, icon: Icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-5 py-4 transition-all duration-200 border-l-4 ${
        isActive 
          ? 'bg-jd-yellow text-jd-black font-bold border-white shadow-inner' 
          : 'text-white border-transparent hover:bg-[#2a6022] hover:border-jd-yellow'
      }`}
    >
      <Icon size={22} />
      <span className="text-sm uppercase tracking-wide">{label}</span>
    </Link>
  );
};

export const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 font-sans">
      {/* Sidebar para Desktop y Mobile Overlay */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 bg-jd-green transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        {/* Header Logo */}
        <div className="h-20 flex items-center px-6 bg-[#2e6a25] border-b border-green-800 shadow-sm justify-between">
          <div className="flex items-center">
            <div className="bg-jd-yellow p-1.5 rounded mr-3 shadow-md">
               <div className="w-7 h-7 bg-jd-green rounded flex items-center justify-center text-white font-bold text-xs border border-jd-yellow">JD</div>
            </div>
            <div>
              <h1 className="text-white font-extrabold text-xl leading-none tracking-tighter">POWER</h1>
              <span className="text-jd-yellow text-sm font-bold tracking-widest">SERVICE</span>
            </div>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-white">
            <X size={24} />
          </button>
        </div>
        
        {/* Navegación */}
        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          <SidebarItem to="/" icon={CheckSquare} label="Requisitos" onClick={() => setIsMobileMenuOpen(false)} />
          <SidebarItem to="/planes" icon={LayoutDashboard} label="Planes de Acción" onClick={() => setIsMobileMenuOpen(false)} />
          <SidebarItem to="/cronograma" icon={CalendarRange} label="Cronograma" onClick={() => setIsMobileMenuOpen(false)} />
          <SidebarItem to="/kpis" icon={BarChart3} label="KPIs" onClick={() => setIsMobileMenuOpen(false)} />
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-green-800 text-green-100 text-xs text-center bg-[#2e6a25]">
          <p className="font-bold">App de Mejora Continua</p>
          <p className="opacity-50 mt-1">v1.0 - John Deere Style</p>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Mobile */}
        <header className="md:hidden bg-jd-green h-16 flex items-center px-4 shadow-md z-10 flex-shrink-0">
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-white p-2">
            <Menu size={24} />
          </button>
          <span className="ml-3 font-bold text-white text-lg">POWER SERVICE</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F3F4F6]">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};