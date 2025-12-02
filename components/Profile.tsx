import React, { useEffect, useState } from 'react';
import { HistoryItem, UserProfile } from '../types';
import { DiagnosisDisplay } from './DiagnosisDisplay';
import { Trash2, ChevronDown, ChevronUp, Calendar, Trophy, Star, Shield, Send, Car, X, MessageSquare } from 'lucide-react';

export const Profile: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Rating Modal State
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [ratingItemId, setRatingItemId] = useState<string | null>(null);
  const [tempRating, setTempRating] = useState(0);
  const [tempReview, setTempReview] = useState('');

  useEffect(() => {
    const storedHistory = localStorage.getItem('serviceHistory');
    const storedProfile = localStorage.getItem('userProfile');
    
    if (storedHistory) {
      try {
        setHistoryItems(JSON.parse(storedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    if (storedProfile) {
        try {
            setProfile(JSON.parse(storedProfile));
        } catch (e) {
            console.error("Failed to parse profile", e);
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

  const openRatingModal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setRatingItemId(id);
    setTempRating(0);
    setTempReview('');
    setIsRatingModalOpen(true);
  };

  const submitRating = () => {
    if (!ratingItemId || tempRating === 0) return;

    const updatedHistory = historyItems.map(item => {
        if (item.id === ratingItemId) {
            return { ...item, rating: tempRating, review: tempReview };
        }
        return item;
    });

    setHistoryItems(updatedHistory);
    localStorage.setItem('serviceHistory', JSON.stringify(updatedHistory));
    setIsRatingModalOpen(false);
  };

  const sendToWhatsApp = (item: HistoryItem) => {
    const message = `Hola TalpaPits, soy ${profile?.name || 'Cliente'}. Consulto sobre un diagnóstico guardado (${formatDate(item.date)}).
    
Auto: ${profile?.carModel || 'No especificado'}
Problema: ${item.result.diagnosis}
Severidad: ${item.result.severity}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/523881039121?text=${encodedMessage}`, '_blank');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  // Gamification Logic
  const getLevel = (count: number) => {
    if (count >= 6) return { name: 'Oro VIP', color: 'text-yellow-500', bg: 'bg-yellow-50', icon: Trophy, next: 100, progress: 100 };
    if (count >= 3) return { name: 'Plata', color: 'text-slate-400', bg: 'bg-slate-100', icon: Shield, next: 6, progress: (count / 6) * 100 };
    return { name: 'Bronce', color: 'text-orange-700', bg: 'bg-orange-50', icon: Star, next: 3, progress: (count / 3) * 100 };
  };

  const level = getLevel(historyItems.length);
  const LevelIcon = level.icon;

  if (!profile) return <div className="p-8 text-center">Cargando perfil...</div>;

  return (
    <div className="pb-24 pt-6 px-4 bg-slate-50 min-h-screen relative">
      
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 mb-8 relative overflow-hidden">
        <div className={`absolute top-0 right-0 p-3 opacity-10 ${level.color}`}>
            <LevelIcon size={100} />
        </div>
        
        <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 text-white flex items-center justify-center text-2xl font-bold">
                    {profile.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
                    <p className="text-slate-500 text-sm flex items-center gap-1">
                        <Car size={14} /> {profile.carModel}
                    </p>
                </div>
            </div>

            <div className={`p-4 rounded-xl ${level.bg} border border-dashed border-slate-200`}>
                <div className="flex justify-between items-center mb-2">
                    <span className={`font-bold uppercase text-xs tracking-wider ${level.color}`}>
                        Nivel {level.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                        {historyItems.length} Servicios
                    </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-slate-200 mb-3">
                    <div 
                        className={`h-full ${level.color.replace('text', 'bg')} transition-all duration-1000`} 
                        style={{ width: `${Math.min(level.progress, 100)}%` }}
                    ></div>
                </div>

                <div className="text-xs text-slate-600">
                    {historyItems.length < 3 && (
                        <p>Faltan {3 - historyItems.length} servicios para desbloquear <span className="font-bold text-slate-800">5% de Descuento</span>.</p>
                    )}
                    {historyItems.length >= 3 && historyItems.length < 6 && (
                        <p>¡Eres Plata! Tienes 5% desc. Faltan {6 - historyItems.length} para <span className="font-bold text-yellow-600">Nivel Oro</span>.</p>
                    )}
                    {historyItems.length >= 6 && (
                        <p>¡Eres VIP! Disfrutas de 10% descuento + Encerado Gratis.</p>
                    )}
                </div>
            </div>
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Calendar size={18} className="text-orange-600" />
        Historial de Servicios
      </h3>

      {historyItems.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-400 text-sm mb-2">Tu historial está vacío.</p>
            <p className="text-xs text-slate-400">Realiza tu primer diagnóstico para subir de nivel.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
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
                            {formatDate(item.date)}
                        </span>
                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase text-white ${
                            item.result.severity === 'Baja' ? 'bg-green-500' :
                            item.result.severity === 'Media' ? 'bg-yellow-500' :
                            item.result.severity === 'Alta' ? 'bg-orange-500' : 'bg-red-500'
                        }`}>
                            {item.result.severity}
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-slate-800 mb-1">{item.result.diagnosis}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">"{item.description}"</p>

                    {/* Rating Section in Card Preview */}
                    <div className="mt-3 mb-2">
                        {item.rating ? (
                             <div className="flex items-center gap-1 bg-yellow-50 inline-flex px-2 py-1 rounded-md border border-yellow-100">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={12} 
                                        className={i < (item.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} 
                                    />
                                ))}
                                <span className="text-xs font-bold text-yellow-700 ml-1">
                                    {item.rating}.0
                                </span>
                             </div>
                        ) : (
                            <button
                                onClick={(e) => openRatingModal(e, item.id)}
                                className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1"
                            >
                                <Star size={12} />
                                Calificar Servicio
                            </button>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-2">
                        <button className="text-orange-600 text-xs font-bold uppercase flex items-center">
                            {expandedId === item.id ? 'Cerrar' : 'Ver Detalles'}
                            {expandedId === item.id ? <ChevronUp size={14} className="ml-1"/> : <ChevronDown size={14} className="ml-1"/>}
                        </button>

                        <button 
                            onClick={(e) => deleteItem(e, item.id)}
                            className="text-slate-300 hover:text-red-500 p-1"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {expandedId === item.id && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                        <DiagnosisDisplay result={item.result} />
                        
                        {item.review && (
                             <div className="mt-4 bg-white p-3 rounded-lg border border-slate-200">
                                 <p className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                                    <MessageSquare size={12}/> Tu Opinión
                                 </p>
                                 <p className="text-sm text-slate-600 italic">"{item.review}"</p>
                             </div>
                        )}

                        <button
                            onClick={() => sendToWhatsApp(item)}
                            className="w-full mt-4 bg-green-600 text-white py-3 rounded-xl font-bold shadow-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            <Send size={18} />
                            Consultar sobre esto
                        </button>
                    </div>
                )}
            </div>
            ))}
        </div>
      )}

      {/* Rating Modal */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-800">Calificar Servicio</h3>
                    <button 
                        onClick={() => setIsRatingModalOpen(false)}
                        className="p-1 bg-slate-100 rounded-full hover:bg-slate-200"
                    >
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>
                
                <p className="text-sm text-slate-500 mb-6 text-center">
                    ¿Qué tal fue la atención del mecánico y el diagnóstico recibido?
                </p>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setTempRating(star)}
                            className="transition-transform hover:scale-110 active:scale-90"
                        >
                            <Star 
                                size={32} 
                                className={`${
                                    star <= tempRating 
                                        ? 'fill-yellow-400 text-yellow-400' 
                                        : 'text-slate-300'
                                }`} 
                            />
                        </button>
                    ))}
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                        Comentario (Opcional)
                    </label>
                    <textarea 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                        rows={3}
                        placeholder="Excelente servicio, muy rápido..."
                        value={tempReview}
                        onChange={(e) => setTempReview(e.target.value)}
                    ></textarea>
                </div>

                <button
                    onClick={submitRating}
                    disabled={tempRating === 0}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                >
                    Enviar Calificación
                </button>
            </div>
        </div>
      )}
    </div>
  );
};