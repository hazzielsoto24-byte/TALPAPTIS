import React from 'react';
import { DiagnosisResult } from '../types';
import { AlertTriangle, Wrench, DollarSign, Info } from 'lucide-react';

interface DiagnosisDisplayProps {
  result: DiagnosisResult;
}

export const DiagnosisDisplay: React.FC<DiagnosisDisplayProps> = ({ result }) => {
  const severityColor = {
    'Baja': 'bg-green-100 text-green-800 border-green-200',
    'Media': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Alta': 'bg-orange-100 text-orange-800 border-orange-200',
    'Crítica': 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border border-slate-100 animate-fade-in relative overflow-hidden">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
        <span className="bg-blue-100 p-2 rounded-full mr-3 text-blue-600">
          <Wrench size={20} />
        </span>
        Diagnóstico Preliminar
      </h3>

      <div className={`px-4 py-2 rounded-lg border mb-4 inline-flex items-center font-semibold text-sm ${severityColor[result.severity]}`}>
        <AlertTriangle className="w-4 h-4 mr-2" />
        Severidad: {result.severity}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Problema Detectado</p>
          <p className="text-lg text-slate-900 font-medium">{result.diagnosis}</p>
        </div>

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">Consejo Inmediato</p>
          <p className="text-slate-700 italic">"{result.advice}"</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
             <div className="flex items-center text-green-700 mb-1">
                <DollarSign size={16} className="mr-1"/>
                <span className="text-xs font-bold uppercase">Costo Estimado</span>
             </div>
             <p className="text-lg font-bold text-slate-800">
               ${result.estimatedCostMin} - ${result.estimatedCostMax} <span className="text-xs font-normal text-slate-500">MXN</span>
             </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
             <div className="flex items-center text-blue-700 mb-1">
                <Wrench size={16} className="mr-1"/>
                <span className="text-xs font-bold uppercase">Herramientas</span>
             </div>
             <p className="text-sm text-slate-700">
               {result.requiredTools.length > 0 ? result.requiredTools[0] + '...' : 'Estándar'}
             </p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 -mx-6 -mb-6 px-6 py-4 border-t border-slate-100 flex items-start gap-3">
         <Info size={16} className="text-slate-400 mt-0.5 flex-shrink-0" />
         <p className="text-xs text-slate-500 leading-relaxed">
             <strong>Aviso Legal:</strong> Este diagnóstico es generado por Inteligencia Artificial y es solo una estimación preliminar. Un mecánico profesional de TalpaPits realizará la evaluación final en persona para garantizar la seguridad y el costo exacto.
         </p>
      </div>
    </div>
  );
};