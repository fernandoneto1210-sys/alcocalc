// src/App.jsx
import React, { useState } from 'react';
import Calculator from './components/Calculator';
import Results from './components/Results';

function App() {
  const [result, setResult] = useState(null);
  const [resultData, setResultData] = useState(null);

  const handleCalculate = (calculationResult, from, to, vol) => {
    setResult(calculationResult);
    setResultData({ from, to, volume: vol });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 py-12 px-4">
      <Calculator onCalculate={handleCalculate} />
      {result && <Results result={result} data={resultData} />}
    </div>
  );
}

export default App;
