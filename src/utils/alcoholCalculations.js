// Calcular álcool puro em ml
export const calculatePureAlcohol = (volume, percentage) => {
  return (volume * percentage) / 100;
};

// Calcular equivalência entre bebidas
export const calculateEquivalence = (
  volumeFrom,
  percentageFrom,
  volumeTo,
  percentageTo
) => {
  const pureAlcoholFrom = calculatePureAlcohol(volumeFrom, percentageFrom);
  const pureAlcoholTo = calculatePureAlcohol(volumeTo, percentageTo);

  return pureAlcoholFrom / pureAlcoholTo;
};

// Calcular total de álcool puro consumido
export const calculateTotalAlcohol = (drinks) => {
  return drinks.reduce((total, drink) => {
    return total + calculatePureAlcohol(drink.volume, drink.percentage);
  }, 0);
};

// Verificar limite seguro (OMS: max 40g álcool/dia homens, 20g mulheres)
// 1ml álcool puro ≈ 0.789g
export const checkSafetyLimit = (totalAlcoholMl, gender = 'male') => {
  const alcoholGrams = totalAlcoholMl * 0.789;
  const limit = gender === 'male' ? 40 : 20;

  return {
    grams: alcoholGrams.toFixed(1),
    limit,
    isWithinLimit: alcoholGrams <= limit,
    percentage: ((alcoholGrams / limit) * 100).toFixed(0)
  };
};
