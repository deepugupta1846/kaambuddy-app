import React, { useState } from 'react';
import { Modal } from 'react-native';
import ServiceCategoriesPage from './ServiceCategoriesPage';
import ServiceCategoryDetailPage from './ServiceCategoryDetailPage';

const ServiceNavigation = ({ 
  visible, 
  service, 
  onClose 
}) => {
  const [currentView, setCurrentView] = useState('categories'); // 'categories' or 'details'
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setCurrentView('details');
  };

  const handleBack = () => {
    if (currentView === 'details') {
      setCurrentView('categories');
      setSelectedCategory(null);
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    onClose();
  };

  if (!service) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      {currentView === 'categories' ? (
        <ServiceCategoriesPage
          service={service}
          onCategorySelect={handleCategorySelect}
          onClose={handleClose}
        />
      ) : (
        <ServiceCategoryDetailPage
          service={service}
          category={selectedCategory}
          onBack={handleBack}
          onServiceSelect={(serviceItem) => {
            console.log('Service selected:', serviceItem);
          }}
        />
      )}
    </Modal>
  );
};

export default ServiceNavigation;

