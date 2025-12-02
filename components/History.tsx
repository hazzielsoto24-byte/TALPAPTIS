import React, { useEffect, useState } from 'react';
import { HistoryItem } from '../types';
import { DiagnosisDisplay } from './DiagnosisDisplay';
import { Trash2, ChevronDown, ChevronUp, Calendar, AlertCircle, Send } from 'lucide-react';

export const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const storedHistory = localStorage.getItem('serviceHistory');
    if (storedHistory) {
      try {
        setHistoryItems(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const deleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que quieres borrar este registro?')) {
      const updatedHistory = historyItems.filter(item => item.id !== id);
      setHistoryItems(updatedHistory);
      localStorage.setItem('serviceHistory', JSON.stringify(updatedHistory));
    }
  };

  const sendToWhatsApp = (item: HistoryItem) => {
    const message = `Hola TalpaPits, consulto sobre un diagnóstico guardado de fecha ${formatDate(item.date)}.
    
Problema: ${item.result.diagnosis}
Severidad: ${item.result.severity}
Descripción original: ${item.description}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/523881039121?text=${encodedMessage}`, '_blank');
  };

  const severityColor = {
    'Baja': 'bg-green-500',
    'Media': 'bg-yellow-500',
    'Alta': 'bg-orange-500',
    'Crítica': 'bg-red-500',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  if (historyItems.length === 0) {
    return (
      <div className="pb-24 pt-8 px-6 bg-slate-50 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="bg-white p-6 rounded-full shadow-md mb-6">
            <Calendar size={48} className="text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Sin Historial</h2>
        <p className="text-slate-500 max-w-xs">
          Aún no has solicitado diagnósticos. Ve a la sección "Solicitar" para revisar tu vehículo.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Historial de Servicios</h2>

      <div className="space-y-4">
        {historyItems.map((item) => (
          <div 
            key={item.id} 
            className={`bg-white rounded-xl shadow-sm border transition-all overflow-hidden ${
                expandedId === item.id ? 'border-orange-200 ring-1 ring-orange-100' : 'border-slate-200'
            }`}
          >
            <div 
                className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggleExpand(item.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {formatDate(item.date)}
                </span>
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase text-white ${severityColor[item.result.severity] || 'bg-slate-500'}`}>
                    {item.result.severity}
                </div>
              </div>
              
              <h3 className="font-bold text-slate-800 mb-1">{item.result.diagnosis}</h3>
              <p className="text-sm text-slate-500 line-clamp-2 mb-3">"{item.description}"</p>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                 <button 
                    className="text-orange-600 text-sm font-medium flex items-center hover:underline"
                 >
                    {expandedId === item.id ? 'Ocultar Detalles' : 'Ver Diagnóstico'}
                    {expandedId === item.id ? <ChevronUp size={16} className="ml-1"/> : <ChevronDown size={16} className="ml-1"/>}
                 </button>

                 <button 
                    onClick={(e) => deleteItem(e, item.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                 >
                    <Trash2 size={16} />
                 </button>
              </div>
            </div>

            {expandedId === item.id && (
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                    <DiagnosisDisplay result={item.result} />
                    
                    <button
                        onClick={() => sendToWhatsApp(item)}
                        className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold shadow-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                        <Send size={18} />
                        Contactar a TalpaPits por WhatsApp
                    </button>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};