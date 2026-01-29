import React from 'react';
import LoyaltySettings from '../components/Loyalty/LoyaltySettings';
import usePageTitle from '../hooks/usePageTitle';

// Страница с настройками программы лояльности
const LoyaltySettingsPage = () => {
  usePageTitle("Настройки лояльности");

  return (
    <div className="container py-4">
      <LoyaltySettings />
    </div>
  );
};

export default LoyaltySettingsPage;
