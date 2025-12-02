import React, { useState } from 'react';
import { User, Car, ArrowRight, ShieldCheck } from 'lucide-react';
import { UserProfile, ViewState } from '../types';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [carModel, setCarModel] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !carModel) return;

    const profile: UserProfile = {
      name,
      carModel,
      joinDate: new Date().toISOString()
    };

    localStorage.setItem('userProfile', JSON.stringify(profile));
    onComplete();
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80" 
            alt="Car Background" 
            className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-10">
            {/* Logo placeholder logic similar to Home */}
            <h1 className="text-5xl font-black italic tracking-tighter text-white mb-2" style={{fontFamily: 'Inter, sans-serif', transform: 'skew(-10deg)'}}>
                Talpa<span className="text-orange-500">Pits</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
                Tu copiloto mecánico
            </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Crea tu Perfil</h2>
          <p className="text-slate-300 text-sm mb-6">
            Regístrate para generar historial, obtener diagnósticos y desbloquear descuentos exclusivos.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-orange-400 uppercase mb-1 ml-1">Tu Nombre</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-orange-400 uppercase mb-1 ml-1">Tu Vehículo</label>
              <div className="relative">
                <Car className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="Ej. Nissan Tsuru 2010"
                  className="w-full bg-slate-800/50 border border-slate-600 text-white pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    Arrancar Motores <ArrowRight size={20} />
                </button>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-[10px]">
            <ShieldCheck size={12} />
            <span>Tus datos se guardan solo en tu dispositivo.</span>
          </div>
        </div>
      </div>
    </div>
  );
};