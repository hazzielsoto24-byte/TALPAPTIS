import React from 'react';
import { Wrench, Home, User, Sparkles, ShoppingBag } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const navItemClass = (view: ViewState) =>
    `flex flex-col items-center justify-center w-full h-full text-[10px] sm:text-xs font-medium transition-colors ${
      currentView === view ? 'text-orange-600' : 'text-slate-400 hover:text-slate-800'
    }`;

  // Don't render navbar on Onboarding screen
  if (currentView === ViewState.ONBOARDING) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 h-16 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around h-full items-center px-1">
        <button onClick={() => setView(ViewState.HOME)} className={navItemClass(ViewState.HOME)}>
          <Home className="w-5 h-5 mb-1" />
          Inicio
        </button>
        <button onClick={() => setView(ViewState.REQUEST)} className={navItemClass(ViewState.REQUEST)}>
          <Wrench className="w-5 h-5 mb-1" />
          Solicitar
        </button>
        <button onClick={() => setView(ViewState.SERVICES)} className={navItemClass(ViewState.SERVICES)}>
          <Sparkles className="w-5 h-5 mb-1" />
          Servicios
        </button>
        <button onClick={() => setView(ViewState.PROFILE)} className={navItemClass(ViewState.PROFILE)}>
          <User className="w-5 h-5 mb-1" />
          Mi Perfil
        </button>
        <button onClick={() => setView(ViewState.STORE)} className={navItemClass(ViewState.STORE)}>
          <ShoppingBag className="w-5 h-5 mb-1" />
          Tienda
        </button>
      </div>
    </nav>
  );
};