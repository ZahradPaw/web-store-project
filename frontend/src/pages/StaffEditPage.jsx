import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StaffEdit from '../components/Staff/StaffEdit';
import LoadingComponent from '../components/LoadingComponent';
import ErrorRetryComponent from '../components/ErrorRetryComponent';
import { getUser } from '../endpoints/api';
import usePageTitle from '../hooks/usePageTitle';

// Страница управления данными сотрудника
const StaffEditPage = () => {
  const { id } = useParams();
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  usePageTitle(staff && `Редактирование сотрудника: ${staff.first_name} ${staff.last_name}`);

  useEffect(() => {
    loadStaff();
  }, [id]);

  // Загрузка сотрудника
  const loadStaff = async () => {
    setLoading(true);
    setError(''); 
    
    const result = await getUser(id);

    if (result.success) {
      setStaff(result.data)
    }
    else {
      setError(result.error);
    }
    setLoading(false);
  } 

  // Контент при загрузке
  if (loading) {
   return (
      <div className="container py-4">
        <LoadingComponent text={'Загрузка сотрудника...'} />
      </div>
    );
  }

  // Контент при ошибке
  if (error) {
    return (
      <div className="container py-4">
        <ErrorRetryComponent 
          error={error}
          onClick={loadStaff}
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-2">
        <div className="col-12">
          <button
            className="btn btn-outline-secondary mb-3"
            onClick={() => navigate('/staff/list')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Назад к списку сотрудников
          </button>
        </div>
      </div>

      <StaffEdit staff={staff} />
    </div>
  );
};

export default StaffEditPage;
