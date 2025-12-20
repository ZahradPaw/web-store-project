import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import UserInfo from '../components/Profile/UserInfo';
import ClientStats from '../components/Profile/ClientStats';
import LoadingComponent from '../components/LoadingComponent';

// Страница личного кабинета пользователя
const ProfilePage = () => {
  const { user, loading } = useAuthContext();

  // Загрузка профиля
  if (loading) {
    return (
      <div>
        <LoadingComponent text={'Загрузка профиля...'} />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="page-title">Личный кабинет</h2>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Основная информация */}
        <div className="">
          <div className="row">
            <div className="col-12 mb-4">
              <UserInfo user={user} />
            </div>

            {/* Статистика для клиентов */}
            {user.role === 'client' && (
              <div className="col-12 mb-4">
                <ClientStats user={user} />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
