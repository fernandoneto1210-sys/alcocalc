import React, { useState, useEffect } from 'react';
import { Wine } from 'lucide-react';
import Calculator from './components/Calculator';
import SafetyAlert from './components/SafetyAlert';
import HistoryList from './components/HistoryList';
import { calculateTotalAlcohol } from './utils/alcoholCalculations';

function App() {
  const [history, setHistory] = useState([]);
  const [totalAlcohol, setTotalAlcohol] = useState(0);
  const [gender, setGender] = useState('male');

  useEffect(() => {
    const saved = localStorage.getItem('alcoholHistory');
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed);
      updateTotalAlcohol(parsed);
    }
  }, []);

  const updateTotalAlcohol = (historyData) => {
    const drinks = historyData.map(item => ({
      volume: item.from.volume,
      percentage: item.from.percentage
    }));
    setTotalAlcohol(calculateTotalAlcohol(drinks));
  };

  const handleCalculate = (result) => {
    const newHistory = [result, ...history].slice(0, 20);
    setHistory(newHistory);
    updateTotalAlcohol(newHistory);
    localStorage.setItem('alcoholHistory', JSON.stringify(newHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    setTotalAlcohol(0);
    localStorage.removeItem('alcoholHistory');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <main className="max-w-5xl mx-auto px-4 space-y-8">
        <Calculator onCalculate={handleCalculate} gender={gender} setGender={setGender} />
        {totalAlcohol > 0 && <SafetyAlert totalAlcohol={totalAlcohol} gender={gender} />}
        <HistoryList history={history} onClear={handleClearHistory} />
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-600 text-sm mt-12">
        <p>⚠️ Beba com moderação. Nunca dirija após consumir álcool.</p>
        <p className="mt-2">Limites baseados nas recomendações da OMS</p>
      </footer>
    </div>
  );
}

export default App;

