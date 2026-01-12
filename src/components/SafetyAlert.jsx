import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { checkSafetyLimit } from '../utils/alcoholCalculations';

const SafetyAlert = ({ totalAlcohol, gender = 'male' }) => {
  const safety = checkSafetyLimit(totalAlcohol, gender);

  return (
    <div className={`rounded-2xl p-6 border-2 max-w-5xl mx-auto ${
      safety.isWithinLimit 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex gap-4">
        {safety.isWithinLimit ? (
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
        ) : (
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
        )}

        <div className="flex-1">
          <h3 className={`font-bold mb-2 ${
            safety.isWithinLimit ? 'text-green-800' : 'text-red-800'
          }`}>
            {safety.isWithinLimit ? '✅ Consumo Dentro do Limite' : '⚠️ Atenção: Limite Excedido'}
          </h3>

          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              Consumo: <span className="font-bold">{safety.grams}g</span> de álcool puro
            </p>
            <p className="text-gray-700">
              Limite recomendado (OMS): <span className="font-bold">{safety.limit}g</span>
            </p>

            <div className="mt-3">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-600">Progresso</span>
                <span className="font-bold">{safety.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    safety.isWithinLimit ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(safety.percentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyAlert;
