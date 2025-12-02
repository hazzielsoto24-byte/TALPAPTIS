import React from 'react';
import { Droplet, Wrench, Sparkles, Zap, Calendar, ArrowRight } from 'lucide-react';

export const ServicesList: React.FC = () => {
  const packages = [
    {
      id: 'wash-basic',
      title: 'Autolavado Express',
      price: '$150',
      icon: <Droplet className="w-8 h-8 text-blue-500" />,
      features: ['Lavado exterior', 'Aspirado básico', 'Brillo en llantas'],
      color: 'blue'
    },
    {
      id: 'wash-premium',
      title: 'Lavado Premium + Cera',
      price: '$350',
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      features: ['Lavado detallado', 'Aspirado profundo', 'Encerado a mano', 'Limpieza de tablero', 'Aroma'],
      color: 'purple'
    },
    {
      id: 'oil-change',
      title: 'Cambio de Aceite',
      price: 'Desde $800',
      icon: <Droplet className="w-8 h-8 text-yellow-600" />,
      features: ['Aceite Multigrado/Sintético', 'Filtro de aceite nuevo', 'Revisión de 10 puntos de seguridad'],
      color: 'yellow'
    },
    {
      id: 'tune-up',
      title: 'Afinación Mayor',
      price: 'Cotizar',
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      features: ['Cambio de bujías', 'Filtros de aire y gasolina', 'Lavado de inyectores', 'Limpieza cuerpo aceleración'],
      color: 'orange'
    },
    {
      id: 'brakes',
      title: 'Servicio de Frenos',
      price: 'Cotizar',
      icon: <Wrench className="w-8 h-8 text-red-500" />,
      features: ['Limpieza y ajuste', 'Cambio de balatas (si requiere)', 'Rectificado de discos', 'Revisión líquido de frenos'],
      color: 'red'
    }
  ];

  const handleBooking = (title: string) => {
    const message = `Hola TalpaPits, me interesa agendar el servicio de: ${title}. ¿Tienen disponibilidad?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/523881039121?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="pb-24 pt-6 px-4 bg-slate-50 min-h-screen animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Paquetes de Servicio</h2>
        <p className="text-slate-500 text-sm mt-1">Mantenimiento preventivo y estética a domicilio</p>
      </div>

      <div className="space-y-6">
        {/* Banner Promocional */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="font-bold text-xl mb-1">¡Mantén tu auto como nuevo!</h3>
                <p className="text-blue-100 text-xs mb-4 max-w-[80%]">Agenda tu cita mensual y evita fallas costosas en el futuro.</p>
                <button 
                    onClick={() => handleBooking('Consulta General')}
                    className="bg-white text-blue-700 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-blue-50 transition-colors"
                >
                    Agendar Cita General
                </button>
            </div>
            <Sparkles className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white opacity-10" />
        </div>

        {/* Lista de Paquetes */}
        <div className="grid gap-4">
            {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                            <div className={`p-3 rounded-xl bg-${pkg.color}-50`}>
                                {pkg.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{pkg.title}</h3>
                                <p className="text-slate-500 text-sm font-semibold">{pkg.price}</p>
                            </div>
                        </div>
                    </div>
                    
                    <ul className="space-y-2 mb-4 flex-1">
                        {pkg.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center text-xs text-slate-600">
                                <span className={`w-1.5 h-1.5 rounded-full bg-${pkg.color}-400 mr-2`}></span>
                                {feature}
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={() => handleBooking(pkg.title)}
                        className="w-full py-3 rounded-lg border-2 border-slate-100 text-slate-700 font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Calendar size={16} />
                        Agendar Cita
                    </button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};