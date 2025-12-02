import React, { useEffect, useRef } from 'react';
import { ViewState } from '../types';
import { Truck, Clock, MapPin, Phone, Sparkles, ArrowRight } from 'lucide-react';

// Declaration to satisfy TypeScript since L is loaded via CDN
declare const L: any;

interface HomeProps {
  setView: (view: ViewState) => void;
}

export const Home: React.FC<HomeProps> = ({ setView }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Initialize map only if it hasn't been initialized and L exists
    if (mapContainerRef.current && !mapInstanceRef.current && typeof L !== 'undefined') {
      // Coordinates for Talpa de Allende
      const talpaCoords = [20.3815, -104.8266];
      
      const map = L.map(mapContainerRef.current, {
        center: talpaCoords,
        zoom: 14,
        zoomControl: false, // Cleaner look for mobile
        attributionControl: false 
      });

      // Dark/Clean map tiles (CartoDB Voyager is good for clean apps, using OpenStreetMap standard here for reliability)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Add Coverage Circle (Orange)
      L.circle(talpaCoords, {
        color: '#ea580c', // Orange-600
        fillColor: '#ea580c',
        fillOpacity: 0.2,
        radius: 2000 // 2km radius
      }).addTo(map);

      // Add Marker for Base
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: #ea580c; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      L.marker(talpaCoords, { icon: customIcon }).addTo(map)
        .bindPopup("Base Central TalpaPits")
        .openPopup();

      mapInstanceRef.current = map;
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="pb-24 bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white py-12 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
            <img 
                src="https://picsum.photos/800/600?grayscale" 
                alt="Background" 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="relative z-10 text-center flex flex-col items-center">
            {/* Logo Image - Expects 'logo.png' in public folder */}
            <div className="mb-4 relative">
                <img 
                    src="logo.png" 
                    alt="TalpaPits" 
                    className="h-32 w-auto object-contain drop-shadow-2xl mx-auto relative z-10"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = document.getElementById('logo-text-fallback');
                        if (fallback) fallback.style.display = 'block';
                    }}
                />
                {/* Fallback text if image not found */}
                <h1 id="logo-text-fallback" className="hidden text-5xl font-black italic tracking-tighter mb-2" style={{fontFamily: 'Inter, sans-serif', transform: 'skew(-10deg)'}}>
                    Talpa<span className="text-orange-500">Pits</span>
                </h1>
            </div>
            
            <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-6 bg-slate-900/50 px-3 py-1 rounded-full border border-orange-500/30">
                Mecánica Express & Detallado
            </p>
            <p className="text-slate-300 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
                Expertos en motores y estética automotriz. <br/>Asistencia en ruta en todo Talpa de Allende.
            </p>
            <button 
                onClick={() => setView(ViewState.REQUEST)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full font-bold shadow-xl transform transition hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
            >
                <Truck size={20} />
                Pedir Ayuda Ahora
            </button>
        </div>
      </div>

      {/* Promo Banner for Services */}
      <div className="px-4 mt-6">
        <div 
          onClick={() => setView(ViewState.SERVICES)}
          className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-xl p-5 text-white shadow-lg shadow-indigo-200 flex items-center justify-between cursor-pointer active:scale-95 transition-transform border border-indigo-500"
        >
            <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                    <Sparkles size={24} className="text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-base">Paquetes de Lavado</h3>
                    <p className="text-xs text-indigo-100 opacity-90">Dale brillo a tu auto hoy mismo</p>
                </div>
            </div>
            <ArrowRight size={20} className="text-white/80" />
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-4 mt-6 relative z-20">
        <div className="bg-white rounded-xl shadow-lg p-6 grid grid-cols-2 gap-4 border border-slate-100">
            <div className="text-center p-2">
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-blue-600 border border-blue-100">
                    <Clock size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Rápido</h3>
                <p className="text-xs text-slate-500">Llegamos en minutos</p>
            </div>
            <div className="text-center p-2">
                <div className="bg-orange-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-orange-600 border border-orange-100">
                    <MapPin size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Cobertura</h3>
                <p className="text-xs text-slate-500">Talpa y alrededores</p>
            </div>
            <div className="text-center p-2">
                <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-green-600 border border-green-100">
                    <Truck size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Móvil</h3>
                <p className="text-xs text-slate-500">Taller equipado</p>
            </div>
            <div className="text-center p-2">
                <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-600 border border-purple-100">
                    <Phone size={24} />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">WhatsApp</h3>
                <p className="text-xs text-slate-500">Contacto directo</p>
            </div>
        </div>
      </div>

      {/* Interactive Coverage Map */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
             <h3 className="font-bold text-slate-800 flex items-center">
                <MapPin size={18} className="text-orange-600 mr-2" />
                Zona de Cobertura
             </h3>
             <p className="text-xs text-slate-500">Servicio móvil en Talpa de Allende (2km radio)</p>
          </div>
          <div 
            ref={mapContainerRef} 
            className="w-full h-64 z-10 bg-slate-100"
            style={{ minHeight: '250px' }}
          >
            {/* Map renders here */}
          </div>
        </div>
      </div>

      <div className="px-6 mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Servicios Comunes</h2>
        <div className="space-y-3">
            {[
                "Cambio de llantas / Ponchaduras",
                "Paso de corriente (Batería)",
                "Frenos y Balatas",
                "Diagnóstico por Computadora",
                "Mecánica General"
            ].map((service, idx) => (
                <div key={idx} className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-slate-100 hover:border-orange-200 transition-colors">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    <span className="text-slate-700 text-sm font-medium">{service}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};