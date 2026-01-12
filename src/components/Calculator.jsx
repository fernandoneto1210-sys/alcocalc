import React, { useState, useEffect } from 'react';
import { Plus, X, ArrowRight, Calculator as CalcIcon } from 'lucide-react';
import { calculateEquivalence, calculatePureAlcohol } from '../utils/alcoholCalculations';
import { defaultDrinks } from '../data/defaultDrinks';

const Calculator = ({ onCalculate, gender, setGender }) => {
  const [drinks, setDrinks] = useState([]);
  const [fromDrink, setFromDrink] = useState(null);
  const [toDrink, setToDrink] = useState(null);
  const [fromVolume, setFromVolume] = useState(150);
  const [toVolume, setToVolume] = useState(350);
  const [result, setResult] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDrink, setNewDrink] = useState({
    name: '',
    percentage: '',
    volume: '',
    icon: '🍹'
  });

  useEffect(() => {
    const savedDrinks = localStorage.getItem('customDrinks');
    const customDrinks = savedDrinks ? JSON.parse(savedDrinks) : [];
    const allDrinks = [...defaultDrinks, ...customDrinks];
    setDrinks(allDrinks);
    setFromDrink(allDrinks[2]);
    setToDrink(allDrinks[0]);
  }, []);

  const handleCalculate = () => {
    if (!fromDrink || !toDrink) return;

    const equivalence = calculateEquivalence(
      fromVolume,
      fromDrink.percentage,
      toVolume,
      toDrink.percentage
    );

    const pureAlcoholFrom = calculatePureAlcohol(fromVolume, fromDrink.percentage);

    const resultData = {
      from: {
        name: fromDrink.name,
        volume: fromVolume,
        percentage: fromDrink.percentage,
        icon: fromDrink.icon
      },
      to: {
        name: toDrink.name,
        volume: toVolume,
        percentage: toDrink.percentage,
        icon: toDrink.icon
      },
      equivalence: equivalence.toFixed(2),
      pureAlcohol: pureAlcoholFrom.toFixed(2),
      timestamp: new Date().toISOString()
    };

    setResult(resultData);
    onCalculate(resultData);
  };

  const selectDrink = (drink, type) => {
    if (type === 'from') {
      setFromDrink(drink);
      setFromVolume(drink.standardVolume);
    } else {
      setToDrink(drink);
      setToVolume(drink.standardVolume);
    }
  };

  const handleAddDrink = () => {
    if (!newDrink.name || !newDrink.percentage || !newDrink.volume) {
      alert('Preencha todos os campos!');
      return;
    }

    const customDrink = {
      id: Date.now(),
      name: newDrink.name,
      type: 'Personalizada',
      percentage: parseFloat(newDrink.percentage),
      standardVolume: parseInt(newDrink.volume),
      icon: newDrink.icon,
      isCustom: true
    };

    const savedDrinks = localStorage.getItem('customDrinks');
    const customDrinks = savedDrinks ? JSON.parse(savedDrinks) : [];
    const updatedCustomDrinks = [...customDrinks, customDrink];

    localStorage.setItem('customDrinks', JSON.stringify(updatedCustomDrinks));

    const allDrinks = [...defaultDrinks, ...updatedCustomDrinks];
    setDrinks(allDrinks);

    setNewDrink({ name: '', percentage: '', volume: '', icon: '🍹' });
    setShowAddForm(false);
  };

  const handleDeleteDrink = (drinkId) => {
    const savedDrinks = localStorage.getItem('customDrinks');
    const customDrinks = savedDrinks ? JSON.parse(savedDrinks) : [];
    const updated = customDrinks.filter(d => d.id !== drinkId);

    localStorage.setItem('customDrinks', JSON.stringify(updated));

    const allDrinks = [...defaultDrinks, ...updated];
    setDrinks(allDrinks);
  };

  const icons = ['🍺', '🍷', '🥂', '🍾', '🥃', '🍸', '🍹', '🧃', '🥤', '☕'];

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-purple-500 p-3 rounded-xl">
            <CalcIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Calculadora</h1>
            <p className="text-sm text-gray-500">Compare equivalências alcoólicas</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg px-4 py-2 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Adicionar Bebida
        </button>
      </div>

      {/* SELEÇÃO DE NOMES */}
<div className="grid md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700">Seu nome:</label>
    <input
      type="text"
      placeholder="Digite seu nome"
      className="input-styled input-from"
    />
  </div>
  <div className="space-y-2">
    <label className="text-sm font-semibold text-gray-700">Nome do acompanhante:</label>
    <input
      type="text"
      placeholder="Digite o nome (opcional)"
      className="input-styled input-to"
    />
  </div>
</div>
      {/* FORMULÁRIO ADICIONAR BEBIDA */}
      {showAddForm && (
        <div className="mb-6 p-6 bg-cyan-50 rounded-2xl border-2 border-cyan-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Nova Bebida Personalizada</h3>
            <button 
              onClick={() => setShowAddForm(false)} 
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              value={newDrink.name}
              onChange={(e) => setNewDrink({...newDrink, name: e.target.value})}
              placeholder="Nome da bebida"
              className="w-full px-4 py-3 border-2 border-cyan-300 rounded-xl focus:border-cyan-500 focus:outline-none"
            />
            <input
              type="number"
              value={newDrink.percentage}
              onChange={(e) => setNewDrink({...newDrink, percentage: e.target.value})}
              placeholder="Teor (%)"
              step="0.1"
              className="w-full px-4 py-3 border-2 border-cyan-300 rounded-xl focus:border-cyan-500 focus:outline-none"
            />
            <input
              type="number"
              value={newDrink.volume}
              onChange={(e) => setNewDrink({...newDrink, volume: e.target.value})}
              placeholder="Volume (ml)"
              className="w-full px-4 py-3 border-2 border-cyan-300 rounded-xl focus:border-cyan-500 focus:outline-none"
            />
            <select
              value={newDrink.icon}
              onChange={(e) => setNewDrink({...newDrink, icon: e.target.value})}
              className="w-full px-4 py-3 border-2 border-cyan-300 rounded-xl focus:border-cyan-500 focus:outline-none text-lg"
            >
              {icons.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddDrink}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg px-4 py-2 transition-all"
          >
            Salvar Bebida
          </button>
        </div>
      )}

      {/* CALCULADORA - DUAS COLUNAS */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* COLUNA DE: */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-600 to-purple-400 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">De:</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2">
            {drinks.map(drink => (
              <div key={drink.id} className="relative group">
                <button
                  onClick={() => selectDrink(drink, 'from')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    fromDrink?.id === drink.id
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{drink.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{drink.name}</div>
                      <div className="text-xs text-gray-600">{drink.percentage}%</div>
                    </div>
                  </div>
                </button>

                {drink.isCustom && (
                  <button
                    onClick={() => handleDeleteDrink(drink.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Volume (ml)</label>
            <input
              type="number"
              value={fromVolume}
              onChange={(e) => setFromVolume(Number(e.target.value))}
              className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:outline-none"
              min="1"
            />
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
            <div className="text-xs text-purple-700 font-medium">Álcool puro:</div>
            <div className="text-2xl font-bold text-purple-600 mt-1">
              {fromDrink && calculatePureAlcohol(fromVolume, fromDrink.percentage).toFixed(2)} ml
            </div>
          </div>
        </div>

        {/* COLUNA PARA: */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-500 to-cyan-400 rounded-full"></div>
            <h2 className="text-2xl font-bold text-gray-800">Para:</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto pr-2 rounded-xl border-2 border-cyan-300 p-3 bg-cyan-50">
            {drinks.map(drink => (
              <div key={drink.id} className="relative group">
                <button
                  onClick={() => selectDrink(drink, 'to')}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    toDrink?.id === drink.id
                      ? 'border-cyan-500 bg-white shadow-lg'
                      : 'border-gray-200 bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{drink.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">{drink.name}</div>
                      <div className="text-xs text-gray-600">{drink.percentage}%</div>
                    </div>
                  </div>
                </button>

                {drink.isCustom && (
                  <button
                    onClick={() => handleDeleteDrink(drink.id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Álcool puro</label>
            <input
              type="text"
              value={toDrink ? `${calculatePureAlcohol(toVolume, toDrink.percentage).toFixed(2)} ml` : ''}
              readOnly
              className="w-full px-4 py-3 border-2 border-cyan-300 rounded-xl bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* BOTÃO CALCULAR */}
      <button
        onClick={handleCalculate}
        className="w-full bg-gradient-to-r from-purple-600 via-purple-500 to-cyan-500 text-white font-bold rounded-full py-3 px-6 hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-8 text-lg"
      >
        <CalcIcon className="w-6 h-6" />
        Calcular Equivalência
      </button>

      {/* RESULTADO */}
      {result && (
        <div className="p-8 bg-gradient-to-br from-purple-50 via-gray-50 to-cyan-50 rounded-2xl border-2 border-gray-200">
          <div className="flex items-center justify-center gap-4 flex-wrap mb-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{result.from.icon}</div>
              <div className="font-semibold text-gray-800">{result.from.volume}ml</div>
              <div className="text-xs text-gray-600">{result.from.name}</div>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400" />

            <div className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-8 py-4 rounded-2xl shadow-lg">
              <div className="text-4xl font-black">{result.equivalence}</div>
              <div className="text-sm font-medium">unidades</div>
            </div>

            <ArrowRight className="w-6 h-6 text-gray-400" />

            <div className="text-center">
              <div className="text-4xl mb-2">{result.to.icon}</div>
              <div className="font-semibold text-gray-800">{result.to.volume}ml</div>
              <div className="text-xs text-gray-600">{result.to.name}</div>
            </div>
          </div>

          <div className="text-center p-4 bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-gray-700">
              Contém aproximadamente <span className="font-bold text-purple-600">{result.pureAlcohol}ml</span> de álcool puro
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;


