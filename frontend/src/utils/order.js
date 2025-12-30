// Статусы заказов
export const STATUSES = {
  CREATED: 'created',
  PAID: 'paid',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const STATUS_DISPLAY_NAMES = {
  'created': 'Оформлен',
  'paid': 'Оплачен',
  'delivered': 'Доставлен',
  'cancelled': 'Отменен'
};

const STATUS_CONFIG = {
  'created': 'warning',
  'paid': 'info',
  'delivered': 'success',
  'cancelled': 'danger'
};

// Отображение статуса заказа
export const getStatusDisplay = (status) => {
  return STATUS_DISPLAY_NAMES[status] || status;
}

// Стиль значка статуса заказа
export const getStatusBadge = (status) => {
  return `badge bg-${STATUS_CONFIG[status] || 'secondary'}`
}
