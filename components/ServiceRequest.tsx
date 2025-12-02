import React, { useState, useRef } from 'react';
import { Camera, MapPin, Loader2, Send, CheckCircle, Home } from 'lucide-react';
import { analyzeCarIssue } from '../services/geminiService';
import { DiagnosisResult, LocationState, HistoryItem } from '../types';
import { DiagnosisDisplay } from './DiagnosisDisplay';

export const ServiceRequest: React.FC = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<LocationState>({ lat: null, lng: null });
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to play a subtle success "ding" using Web Audio API
  const playSuccessSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = 'sine';
      // A pleasant high-pitched "ding" (A5)
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      
      // Volume envelope: start low and fade out quickly
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      // Audio autoplay policy or other error - silently fail
    }
  };

  const handleLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          playSuccessSound();
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            error: undefined
          });
        },
        (error) => {
          setLocation({ ...location, error: 'No se pudo obtener la ubicación. Por favor escríbela abajo.' });
        }
      );
    } else {
      setLocation({ ...location, error: 'Geolocalización no soportada.' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        playSuccessSound();
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToHistory = (result: DiagnosisResult, desc: string) => {
    try {
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        description: desc,
        result: result
      };
      
      const existingHistory = localStorage.getItem('serviceHistory');
      const history: HistoryItem[] = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Add to beginning
      const updatedHistory = [newItem, ...history];
      localStorage.setItem('serviceHistory', JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !image) return;

    setLoading(true);
    setDiagnosis(null);
    try {
      const result = await analyzeCarIssue(description, image || undefined);
      setDiagnosis(result);
      saveToHistory(result, description);
    } catch (error) {
      alert('Error al analizar el problema. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const sendToWhatsApp = () => {
    if (!diagnosis) return;
    
    const locString = location.lat ? `https://maps.google.com/?q=${location.lat},${location.lng}` : "Ubicación pendiente";
    const message = `Hola TalpaPits, necesito ayuda mecánica.
    
Problema: ${diagnosis.diagnosis}
Severidad: ${diagnosis.severity}
Ubicación: ${locString}
Descripción usuario: ${description}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/523881039121?text=${encodedMessage}`, '_blank');
    setShowConfirmation(true);
  };

  const resetForm = () => {
    setDescription('');
    setImage(null);
    setDiagnosis(null);
    setShowConfirmation(false);
    setLocation({ lat: null, lng: null });
  };

  if (showConfirmation) {
    return (
      <div className="pb-24 pt-10 px-6 max-w-lg mx-auto min-h-screen flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="bg-green-100 p-6 rounded-full text-green-600 mb-6 shadow-sm">
          <CheckCircle size={64} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">¡Solicitud Iniciada!</h2>
        <p className="text-slate-600 text-center mb-8 leading-relaxed">
          Hemos abierto WhatsApp con los detalles de tu problema. 
          <br /><br />
          <span className="font-semibold text-slate-800">Importante:</span> Asegúrate de presionar el botón <span className="font-bold text-green-600">"Enviar"</span> en el chat para que recibamos tu ubicación y diagnóstico.
        </p>
        
        <div className="w-full space-y-3">
          <button
            onClick={resetForm}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors"
          >
            Entendido, Nueva Solicitud
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 pt-6 px-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Solicitar Asistencia</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Location Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">Ubicación</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleLocation}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${
                location.lat 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MapPin size={18} />
              {location.lat ? 'Ubicación Detectada' : 'Compartir GPS'}
            </button>
          </div>
          {location.error && <p className="text-xs text-red-500 mt-2">{location.error}</p>}
        </div>

        {/* Image Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Foto del Problema (Opcional)</label>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload}
            />
            
            {!image ? (
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                >
                    <Camera size={32} className="mb-2" />
                    <span className="text-sm">Tocar para tomar foto</span>
                </button>
            ) : (
                <div className="relative">
                    <img src={image} alt="Problem" className="w-full h-48 object-cover rounded-lg" />
                    <button 
                        type="button"
                        onClick={() => setImage(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-lg"
                    >
                        X
                    </button>
                </div>
            )}
        </div>

        {/* Description Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <label className="block text-sm font-medium text-slate-700 mb-2">¿Qué está fallando?</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: El coche no arranca y hace un ruido extraño..."
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          disabled={loading || (!description && !image)}
          className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" /> Analizando con IA...
            </>
          ) : (
            'Diagnosticar Problema'
          )}
        </button>
      </form>

      {diagnosis && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DiagnosisDisplay result={diagnosis} />
            <button
                onClick={sendToWhatsApp}
                className="w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
                <Send size={20} />
                Pedir Mecánico por WhatsApp
            </button>
        </div>
      )}
    </div>
  );
};