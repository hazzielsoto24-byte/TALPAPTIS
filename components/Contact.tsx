import React from 'react';
import { Phone, MessageCircle, Map, ExternalLink } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="pb-24 pt-8 px-6 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Contáctanos</h2>

      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 mb-6">
        <div className="flex flex-col items-center">
            <img 
                src="https://picsum.photos/150/150" 
                alt="Profile" 
                className="w-24 h-24 rounded-full mb-4 border-4 border-orange-100"
            />
            <h3 className="text-xl font-bold text-slate-900">Maestro Mecánico</h3>
            <p className="text-slate-500 mb-6">Especialista en Motores y Suspensión</p>

            <a 
                href="tel:+523881039121" 
                className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-3 rounded-xl mb-3 hover:bg-slate-800 transition-colors"
            >
                <Phone size={20} />
                Llamar (388) 103-9121
            </a>
            
            <a 
                href="https://wa.me/523881039121" 
                className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
                <MessageCircle size={20} />
                Mandar WhatsApp
            </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center">
            <Map size={20} className="mr-2 text-orange-600"/>
            Ubicación del Taller Base
        </h3>
        <p className="text-slate-600 text-sm mb-4">
            Calle Independencia #123<br/>
            Colonia Centro<br/>
            Talpa de Allende, Jalisco
        </p>
        <a 
            href="https://maps.google.com/?q=Talpa+de+Allende" 
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 text-sm font-medium flex items-center hover:underline"
        >
            Ver en Google Maps <ExternalLink size={14} className="ml-1"/>
        </a>
      </div>
    </div>
  );
};