import React from 'react';
import ReportComponent from '../components/Report/ReportComponent';
import usePageTitle from '../hooks/usePageTitle';

// Страница формирования отчетов по таблицам товаров, покупателей и заказов
const ReportPage = () => {
  usePageTitle("Отчеты");

  return (
    <div className="container">
      <ReportComponent />
    </div>
  );
};

export default ReportPage;
