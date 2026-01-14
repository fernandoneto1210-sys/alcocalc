// src/components/Calculator.jsx
import React, { useState, useEffect } from 'react';
import { Calculator as CalcIcon, Plus, X, Users, Edit, Trash2 } from 'lucide-react';
import { defaultDrinks } from '../data/defaultDrinks';
import { calculateEquivalence } from '../utils/alcoholCalculations';

export default function Calculator({ onCalculate }) {
  const [drinks, setDrinks] = useState(defaultDrinks);
  const [fromDrink, setFromDrink] = useState(null);
  const [toDrink, setToDrink] = useState(null);
  const [volume, setVolume] = useState('');
  const [gender, setGender] = useState('male');
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [newDrink, setNewDrink] = useState({
    name: '',
    percentage: '',
    icon: '🍺',
    caloriesPer100ml: ''
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [editingDrink, setEditingDrink] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('customDrinks');
    if (saved) {
      const customDrinks = JSON.parse(saved);
      setDrinks([...defaultDrinks, ...customDrinks]);
    }
  }, []);

  const selectDrink = (drink, type) => {
    if (type === 'from') {
      setFromDrink(drink);
    } else {
      setToDrink(drink);
    }
  };

  const handleAddDrink = () => {
    if (!newDrink.name || !newDrink.percentage) {
      alert('Nome e porcentagem de álcool são obrigatórios.');
      return;
    }

    let calories = parseFloat(newDrink.caloriesPer100ml);
    if (isNaN(calories)) {
      const nameLower = newDrink.name.toLowerCase();
      if (nameLower.includes('cerveja') || nameLower.includes('pilsen') || nameLower.includes('lager')) {
        calories = 43;
      } else if (nameLower.includes('vinho')) {
        calories = 85;
      } else if (nameLower.includes('whisky') || nameLower.includes('vodka') || nameLower.includes('cachaça') || nameLower.includes('tequila') || nameLower.includes('gin')) {
        calories = 231;
      } else if (nameLower.includes('caipirinha') || nameLower.includes('drink') || nameLower.includes('coquetel')) {
        calories = 160;
      } else {
        calories = 70;
      }
    }

    if (editingDrink) {
      const updatedDrinks = drinks.map(d =>
        d.id === editingDrink.id
          ? {
              ...d,
              name: newDrink.name,
              percentage: parseFloat(newDrink.percentage),
              icon: newDrink.icon,
              caloriesPer100ml: calories
            }
          : d
      );
      const customDrinks = updatedDrinks.filter(d => d.isCustom);
      localStorage.setItem('customDrinks', JSON.stringify(customDrinks));
      setDrinks(updatedDrinks);
      setEditingDrink(null);
    } else {
      const customDrink = {
        id: Date.now(),
        name: newDrink.name,
        percentage: parseFloat(newDrink.percentage),
        icon: newDrink.icon,
        caloriesPer100ml: calories,
        isCustom: true
      };
      const customDrinks = drinks.filter(d => d.isCustom);
      customDrinks.push(customDrink);
      localStorage.setItem('customDrinks', JSON.stringify(customDrinks));
      setDrinks([...defaultDrinks, ...customDrinks]);
    }

    setNewDrink({ name: '', percentage: '', icon: '🍺', caloriesPer100ml: '' });
    setShowAddDrink(false);
  };

  const handleEditClick = (drink) => {
    setEditingDrink(drink);
    setNewDrink({
      name: drink.name,
      percentage: drink.percentage.toString(),
      icon: drink.icon,
      caloriesPer100ml: drink.caloriesPer100ml.toString()
    });
    setShowAddDrink(true);
  };

  const handleDeleteDrink = (idToDelete) => {
    if (window.confirm('Tem certeza que deseja excluir esta bebida personalizada?')) {
      const updatedDrinks = drinks.filter(d => d.id !== idToDelete);
      const customDrinks = updatedDrinks.filter(d => d.isCustom);
      localStorage.setItem('customDrinks', JSON.stringify(customDrinks));
      setDrinks([...defaultDrinks, ...customDrinks]);

      if (fromDrink && fromDrink.id === idToDelete) setFromDrink(null);
      if (toDrink && toDrink.id === idToDelete) setToDrink(null);
    }
  };

  const handleCalculate = () => {
    if (!fromDrink || !toDrink || !volume) {
      alert('Por favor, selecione as bebidas e digite o volume.');
      return;
    }

    setIsCalculating(true);
    setTimeout(() => {
      const result = calculateEquivalence(parseFloat(volume), fromDrink, toDrink, gender);
      onCalculate(result, fromDrink, toDrink, parseFloat(volume));
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
      <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-8">
        Calculadora de Equivalência de Álcool
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Coluna DE */}
        <div>
          <h2 className="text-2xl font-bold text-purple-600 mb-4">De:</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {drinks.map((drink) => {
              const isSelected = fromDrink?.id === drink.id;
              return (
                <div key={drink.id} className="relative group">
                  <button
                    onClick={() => selectDrink(drink, 'from')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-100'
                        : 'border-gray-300 bg-gray-50 hover:border-purple-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{drink.icon} {drink.name}</p>
                        <p className="text-sm text-gray-600">{drink.percentage}% de álcool</p>
                      </div>
                      {isSelected && <div className="w-3 h-3 bg-purple-500 rounded-full"></div>}
                    </div>
                  </button>
                  {drink.isCustom && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => handleEditClick(drink)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDrink(drink.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Volume Input */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Volume (ml):</label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Ex: 150"
            />
          </div>

          {/* Álcool Puro Preview (CORRIGIDO) */}
          {fromDrink && volume && (
            <div className="mt-3">
              <input
                type="text"
                value={
                  (parseFloat(volume) * (fromDrink.percentage / 100)).toFixed(1) + ' ml de álcool puro'
                }
                readOnly
                className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg bg-purple-50 text-lg font-semibold text-purple-800"
              />
            </div>
          )}
        </div>

        {/* Coluna PARA */}
        <div>
          <h2 className="text-2xl font-bold text-cyan-600 mb-4">Para:</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {drinks.map((drink) => {
              const isSelected = toDrink?.id === drink.id;
              return (
                <div key={drink.id} className="relative group">
                  <button
                    onClick={() => selectDrink(drink, 'to')}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-100'
                        : 'border-gray-300 bg-gray-50 hover:border-cyan-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">{drink.icon} {drink.name}</p>
                        <p className="text-sm text-gray-600">{drink.percentage}% de álcool</p>
                      </div>
                      {isSelected && <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>}
                    </div>
                  </button>
                  {drink.isCustom && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={() => handleEditClick(drink)}
                        className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDrink(drink.id)}
                        className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gênero Selection */}
      <div className="mb-6 bg-white p-4 rounded-lg border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Gênero:
        </h3>
        <div className="flex gap-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
              className="mr-2 w-4 h-4"
            />
            <span className="text-gray-700 font-medium">Masculino</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
              className="mr-2 w-4 h-4"
            />
            <span className="text-gray-700 font-medium">Feminino</span>
          </label>
        </div>
      </div>

      {/* Botão Calcular */}
      <button
        onClick={handleCalculate}
        disabled={isCalculating}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all ${
          isCalculating
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:from-purple-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105'
        }`}
      >
        <CalcIcon className="inline mr-2 w-5 h-5" />
        {isCalculating ? 'Calculando...' : 'Calcular Equivalência'}
      </button>

      {/* Botão Adicionar Bebida */}
      <button
        onClick={() => {
          setShowAddDrink(!showAddDrink);
          setEditingDrink(null);
          setNewDrink({ name: '', percentage: '', icon: '🍺', caloriesPer100ml: '' });
        }}
        className="w-full mt-4 py-3 px-6 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        {showAddDrink ? 'Cancelar' : 'Adicionar Bebida Personalizada'}
      </button>

      {/* Modal Adicionar Bebida */}
      {showAddDrink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingDrink ? 'Editar Bebida' : 'Adicionar Bebida'}
              </h2>
              <button
                onClick={() => {
                  setShowAddDrink(false);
                  setEditingDrink(null);
                  setNewDrink({ name: '', percentage: '', icon: '🍺', caloriesPer100ml: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Bebida:</label>
                <input
                  type="text"
                  value={newDrink.name}
                  onChange={(e) => setNewDrink({ ...newDrink, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Cerveja Artesanal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Porcentagem de Álcool (%):</label>
                <input
                  type="number"
                  value={newDrink.percentage}
                  onChange={(e) => setNewDrink({ ...newDrink, percentage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 5.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ícone (Emoji):</label>
                <input
                  type="text"
                  value={newDrink.icon}
                  onChange={(e) => setNewDrink({ ...newDrink, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 🍻"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calorias por 100ml (opcional):</label>
                <input
                  type="number"
                  value={newDrink.caloriesPer100ml}
                  onChange={(e) => setNewDrink({ ...newDrink, caloriesPer100ml: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: 45 (se vazio, será estimado)"
                />
              </div>
              <button
                onClick={handleAddDrink}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                {editingDrink ? 'Salvar Alterações' : 'Adicionar Bebida'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

