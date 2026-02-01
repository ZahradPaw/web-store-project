// Локализация даты
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ru-RU');
};

// Локализация даты-времени
export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('ru-RU');
};

// Перевод JSON-данных в форматированную строку
export const formatJsonToString = (jsonData) => {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    
    return Object.entries(data)
        .map(([key, value]) => {
            const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);
            const formattedValue = Array.isArray(value) ? value.join(' ') : value;
            return `${formattedKey}: ${formattedValue}`;
        })
        .join('\n');
};
