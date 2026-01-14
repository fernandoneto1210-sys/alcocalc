// src/utils/alcoholCalculations.js
export function calculateEquivalence(volume, fromDrink, toDrink, gender) {
  const alcoholDensity = 0.789; // g/ml
  const standardDose = 14; // gramas de álcool por dose padrão nos EUA

  const fromCaloriesPer100ml = fromDrink.caloriesPer100ml ? parseFloat(fromDrink.caloriesPer100ml) : 0;
  const toCaloriesPer100ml = toDrink.caloriesPer100ml ? parseFloat(toDrink.caloriesPer100ml) : 0;

  const alcoholGramsFrom = (volume * (fromDrink.percentage / 100)) * alcoholDensity;

  const equivalentVolumeTo = (alcoholGramsFrom / alcoholDensity) / (toDrink.percentage / 100);

  const dosesFrom = alcoholGramsFrom / standardDose;
  const dosesTo = (equivalentVolumeTo * (toDrink.percentage / 100) * alcoholDensity) / standardDose;

  const caloriesFrom = (volume / 100) * fromCaloriesPer100ml;
  const caloriesTo = (equivalentVolumeTo / 100) * toCaloriesPer100ml;

  const weight = gender === 'male' ? 70000 : 60000; // em gramas
  const rFactor = gender === 'male' ? 0.68 : 0.55;
  const bac = (alcoholGramsFrom / (weight * rFactor)) * 100;

  const metabolismRate = 0.015; // % por hora
  const metabolismTime = bac > 0 ? bac / metabolismRate : 0;

  return {
    equivalentVolumeTo,
    dosesFrom,
    dosesTo,
    caloriesFrom,
    caloriesTo,
    bac,
    metabolismTime
  };
}
