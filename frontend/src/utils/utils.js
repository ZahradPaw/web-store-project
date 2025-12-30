// Локализация даты
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};

// Локализация даты-времени
export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('ru-RU');
};
