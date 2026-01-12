import React from 'react';
import { Trash2, ArrowRight, Clock } from 'lucide-react';

const HistoryList = ({ history, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-5xl mx-auto">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Nenhum cálculo realizado ainda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">Histórico</h3>
        <button
          onClick={onClear}
          className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Limpar
        </button>
      </div>

      <div className="space-y-3">
        {history.map((item, index) => (
          <div 
            key={index}
            className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.from.icon}</span>
                <div className="text-sm">
                  <div className="font-semibold text-gray-800">{item.from.volume}ml</div>
                  <div className="text-xs text-gray-500">{item.from.name}</div>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-gray-400" />

              <div className="text-center px-3">
                <div className="text-xl font-bold text-purple-600">
                  {item.equivalence}
                </div>
                <div className="text-xs text-gray-500">unidades</div>
              </div>

              <ArrowRight className="w-4 h-4 text-gray-400" />

              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.to.icon}</span>
                <div className="text-sm">
                  <div className="font-semibold text-gray-800">{item.to.volume}ml</div>
                  <div className="text-xs text-gray-500">{item.to.name}</div>
                </div>
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-400 text-right">
              {new Date(item.timestamp).toLocaleString('pt-BR')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;

