// src/components/Results.jsx
import React from 'react';
import { Info, Flame, AlertTriangle as WarningIcon, BarChart2 } from 'lucide-react';

export default function Results({ result, data }) {
  if (!result || !data) return null;

  let warning = {
    message: '',
    color: 'text-gray-700',
    borderColor: 'border-gray-200',
    bgColor: 'bg-gray-50'
  };

  if (result.bac >= 0.08) {
    warning = {
      message: 'ATENÇÃO: Seu BAC estimado está acima do limite legal para dirigir na maioria dos países. Não dirija!',
      color: 'text-red-700',
      borderColor: 'border-red-400',
      bgColor: 'bg-red-50'
    };
  } else if (result.bac > 0.03) {
    warning = {
      message: 'CUIDADO: Seu BAC estimado pode afetar sua coordenação e julgamento. Consuma com moderação.',
      color: 'text-orange-700',
      borderColor: 'border-orange-400',
      bgColor: 'bg-orange-50'
    };
  } else {
    warning = {
      message: 'Lembre-se de consumir álcool com moderação. Os efeitos variam por pessoa.',
      color: 'text-green-700',
      borderColor: 'border-green-400',
      bgColor: 'bg-green-50'
    };
  }

  let calorieComparisonMessage = '';
  let calorieComparisonColor = 'text-gray-700';
  let calorieBarWidthFrom = 0;
  let calorieBarWidthTo = 0;
  const maxCalories = Math.max(result.caloriesFrom, result.caloriesTo);

  if (maxCalories > 0) {
    calorieBarWidthFrom = (result.caloriesFrom / maxCalories) * 100;
    calorieBarWidthTo = (result.caloriesTo / maxCalories) * 100;
  }

  if (result.caloriesFrom > result.caloriesTo) {
    calorieComparisonMessage = `${data.from.name} tem mais calorias (${result.caloriesFrom.toFixed(0)} kcal) que ${data.to.name} (${result.caloriesTo.toFixed(0)} kcal) para o volume equivalente.`;
    calorieComparisonColor = 'text-orange-700';
  } else if (result.caloriesTo > result.caloriesFrom) {
    calorieComparisonMessage = `${data.to.name} tem mais calorias (${result.caloriesTo.toFixed(0)} kcal) que ${data.from.name} (${result.caloriesFrom.toFixed(0)} kcal) para o volume equivalente.`;
    calorieComparisonColor = 'text-orange-700';
  } else {
    calorieComparisonMessage = `Ambas as bebidas têm calorias equivalentes (${result.caloriesFrom.toFixed(0)} kcal).`;
  }

  // Cálculo CORRETO do álcool puro em ml (SEM multiplicar por 100)
  const alcoholMlFrom = data.volume * (data.from.percentage / 100);
  const alcoholMlTo = result.equivalentVolumeTo * (data.to.percentage / 100);

  // Para o gráfico de álcool puro
  const maxAlcoholMl = Math.max(alcoholMlFrom, alcoholMlTo);
  const alcoholBarWidthFrom = maxAlcoholMl > 0 ? (alcoholMlFrom / maxAlcoholMl) * 100 : 0;
  const alcoholBarWidthTo = maxAlcoholMl > 0 ? (alcoholMlTo / maxAlcoholMl) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl mt-8">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Resultados da Equivalência</h2>

      {/* Seção de Doses e Volumes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="p-4 rounded-xl border-2 border-purple-200 bg-purple-50">
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-6 h-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-800">Sua bebida ({data.from.name}):</h3>
          </div>
          <p className="text-3xl font-bold text-purple-700">
            {result.dosesFrom.toFixed(1)} doses
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ({data.volume} ml de {data.from.name})
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Flame className="w-5 h-5 text-purple-600" />
            <p className="text-lg font-semibold text-purple-700">
              {data.from.icon} {result.caloriesFrom.toFixed(0)} kcal
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border-2 border-cyan-200 bg-cyan-50">
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-6 h-6 text-cyan-600" />
            <h3 className="text-lg font-semibold text-cyan-800">Equivalente em ({data.to.name}):</h3>
          </div>
          <p className="text-3xl font-bold text-cyan-700">
            {result.dosesTo.toFixed(1)} doses
          </p>
          <p className="text-sm text-gray-600 mt-1">
            ({result.equivalentVolumeTo.toFixed(0)} ml de {data.to.name})
          </p>
          <div className="flex items-center gap-2 mt-3">
            <Flame className="w-5 h-5 text-cyan-600" />
            <p className="text-lg font-semibold text-cyan-700">
              {data.to.icon} {result.caloriesTo.toFixed(0)} kcal
            </p>
          </div>
        </div>
      </div>

      {/* Explicação das Doses Iguais */}
      {result.dosesFrom.toFixed(1) === result.dosesTo.toFixed(1) && (
        <div className="p-4 rounded-xl border-2 border-gray-200 bg-gray-50 mb-6">
          <div className="flex items-start gap-3">
            <Info className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Por que as doses são iguais?</h3>
              <p className="text-gray-700 text-base">
                A equivalência alcoólica significa que ambas as bebidas contêm a <strong>mesma quantidade de álcool puro</strong>.
                Embora os volumes e as porcentagens de álcool sejam diferentes, a quantidade total de álcool que você
                consumiria é idêntica, resultando no mesmo número de doses padrão.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gráfico de Álcool Puro (CORRIGIDO) */}
      <div className="p-6 rounded-xl border-2 border-gray-200 bg-gray-50 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart2 className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">Álcool Puro Equivalente (ml)</h3>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-purple-800 mb-1">
              {data.from.name} ({alcoholMlFrom.toFixed(1)} ml de álcool puro)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${alcoholBarWidthFrom}%` }}
              ></div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-cyan-800 mb-1">
              {data.to.name} ({alcoholMlTo.toFixed(1)} ml de álcool puro)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-cyan-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${alcoholBarWidthTo}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparativo de Calorias (Barra Visual) */}
      <div className={`p-6 rounded-xl border-2 border-orange-200 bg-orange-50 mb-6`}>
        <div className="flex items-start gap-3 mb-4">
          <Flame className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Comparativo de Calorias</h3>
            <p className={`${calorieComparisonColor} text-base mb-4`}>
              {calorieComparisonMessage}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-purple-800 mb-1">
              {data.from.name} ({result.caloriesFrom.toFixed(0)} kcal)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${calorieBarWidthFrom}%` }}
              ></div>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-cyan-800 mb-1">
              {data.to.name} ({result.caloriesTo.toFixed(0)} kcal)
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-cyan-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${calorieBarWidthTo}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Informação de Saúde */}
      <div className={`p-6 rounded-xl border-2 ${warning.borderColor} ${warning.bgColor}`}>
        <div className="flex items-start gap-3">
          <WarningIcon className={`w-6 h-6 ${warning.color} flex-shrink-0 mt-1`} />
          <div>
            <h3 className={`text-lg font-semibold ${warning.color} mb-2`}>
              Informação de Saúde
            </h3>
            <p className={`${warning.color} mb-3`}>{warning.message}</p>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• Tempo estimado para metabolizar: {result.metabolismTime.toFixed(1)} horas</p>
              <p>• BAC estimado (pico): {result.bac.toFixed(3)}%</p>
              <p>• Nunca dirija após consumir álcool</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
