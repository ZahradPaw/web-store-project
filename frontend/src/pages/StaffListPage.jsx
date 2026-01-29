import React from 'react';
import StaffList from '../components/Staff/StaffList';
import usePageTitle from '../hooks/usePageTitle';

// Страница с сотрудниками
const StaffListPage = () => {
  usePageTitle("Сотрудники");
  
  return (
    <div className="container py-4">
      <StaffList />
    </div>
  );
};

export default StaffListPage;
