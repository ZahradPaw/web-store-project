// Объект пользователя с полями по-умолчанию
export const createDefaultUser = () => ({
  username: '',
  email: '',
  password: '',
  password2: '',
  first_name: '',
  last_name: '',
  phone: '',
  date_of_birth: '',
  role: ROLES.CLIENT,
});

// Роли пользователей
export const ROLES = {
  CLIENT: 'client',
  MERCHANDISER: 'merchandiser',
  ACCOUNT_MANAGER: 'account_manager',
  SALESPERSON: 'salesperson',
  DIRECTOR: 'director',
  ADMIN: 'admin',
};

const ROLE_DISPLAY_NAMES = {
  'client': 'Покупатель',
  'merchandiser': 'Товаровед',
  'account_manager': 'Клиент-менеджер',
  'salesperson': 'Продавец',
  'director': 'Директор',
  'admin': 'Администратор'
};

// Отображение роли пользователя
export const getRoleDisplay = (role) => {
  return ROLE_DISPLAY_NAMES[role] || role;
}
