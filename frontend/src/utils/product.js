// Объект товара с полями по-умолчанию
export const createDefaultProduct = () => ({
  name: '',
  price: '',
  unit: UNITS.PIECES,
  quantity: '',
  description: ''
});

// Единицы измерения товара
export const UNITS = {
  PIECES: 'pieces',
  KG: 'kg',
  LITER: 'liter'
};

const UNIT_DISPLAY_NAMES = {
  'pieces': 'шт',
  'kg': 'кг',
  'liter': 'л'
};

// Отображение единиц измерения
export const getUnitDisplay = (unit) => {
  return UNIT_DISPLAY_NAMES[unit] || unit;
}
