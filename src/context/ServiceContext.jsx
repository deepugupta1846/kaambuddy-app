import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import apiService from '../config/api';

const ServiceContext = createContext();

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

export const ServiceProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState({}); // { serviceId: [categories] }
  const [categoryServices, setCategoryServices] = useState({}); // { 'serviceId-categoryId': [services] }
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState({}); // { serviceId: boolean }
  const [isLoadingServices, setIsLoadingServices] = useState({}); // { 'serviceId-categoryId': boolean }
  const [error, setError] = useState(null);
  
  // Use refs to track cache without causing re-renders
  const servicesRef = useRef([]);
  const categoriesRef = useRef({});
  const categoryServicesRef = useRef({});

  // Load all main services
  const loadServices = useCallback(async () => {
    // Check cache first using ref
    if (servicesRef.current.length > 0) {
      return servicesRef.current;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getServices(true);
      
      if (response.success && response.data && response.data.services) {
        const formattedServices = response.data.services.map(service => ({
          id: service.id,
          _id: service.id, // Support both id and _id
          name: service.name,
          icon: service.icon || '🔧',
          description: service.description,
          isActive: service.isActive,
          displayOrder: service.displayOrder,
          imageUrl: service.imageUrl,
        }));
        
        servicesRef.current = formattedServices;
        setServices(formattedServices);
        setError(null);
        setIsLoading(false);
        return formattedServices;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to load services from backend:', err);
      let errorMessage = 'Failed to load services. Please check your connection and try again.';
      
      if (err.message && err.message.includes('Network request failed')) {
        errorMessage = 'Cannot connect to server. Please check:\n1. Backend server is running\n2. Correct API URL configured\n3. Network connection is active';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      servicesRef.current = [];
      setServices([]);
      setIsLoading(false);
      return [];
    }
  }, []);

  // Load categories for a specific service
  const loadServiceCategories = useCallback(async (serviceId) => {
    const cacheKey = serviceId;
    
    // Check cache first using ref
    if (categoriesRef.current[cacheKey] && categoriesRef.current[cacheKey].length > 0) {
      return categoriesRef.current[cacheKey];
    }

    setIsLoadingCategories(prev => {
      // Check if already loading
      if (prev[cacheKey]) {
        return prev;
      }
      return { ...prev, [cacheKey]: true };
    });

    try {
      const response = await apiService.getServiceCategories(serviceId, true);
      debugger
      if (response.success && response.data && response.data.categories) {
        const formattedCategories = response.data.categories.map(category => ({
          id: category.id,
          _id: category.id,
          name: category.name,
          icon: category.icon || '🔧',
          description: category.description,
          isActive: category.isActive,
          displayOrder: category.displayOrder,
          imageUrl: category.imageUrl,
        }));
        
        categoriesRef.current[cacheKey] = formattedCategories;
        setCategories(prev => ({ ...prev, [cacheKey]: formattedCategories }));
        setIsLoadingCategories(prev => ({ ...prev, [cacheKey]: false }));
        return formattedCategories;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to load categories from backend:', err);
      categoriesRef.current[cacheKey] = [];
      setCategories(prev => ({ ...prev, [cacheKey]: [] }));
      setIsLoadingCategories(prev => ({ ...prev, [cacheKey]: false }));
      return [];
    }
  }, []);

  // Load service items for a specific category
  const loadCategoryServices = useCallback(async (serviceId, categoryId) => {
    const cacheKey = `${serviceId}-${categoryId}`;
    
    // Check cache first using ref
    if (categoryServicesRef.current[cacheKey] && categoryServicesRef.current[cacheKey].length > 0) {
      return categoryServicesRef.current[cacheKey];
    }

    setIsLoadingServices(prev => {
      // Check if already loading
      if (prev[cacheKey]) {
        return prev;
      }
      return { ...prev, [cacheKey]: true };
    });

    try {
      const response = await apiService.getCategoryServices(serviceId, categoryId, true);
      
      if (response.success && response.data && response.data.services) {
        const formattedServices = response.data.services.map(service => ({
          id: service.id,
          _id: service.id,
          name: service.name,
          description: service.description,
          price: service.price,
          cost: service.price, // Support both price and cost
          duration: service.duration,
          estimatedDuration: service.duration, // Support both duration and estimatedDuration
          rating: service.rating,
          reviews: service.reviews,
          isActive: service.isActive,
          displayOrder: service.displayOrder,
          imageUrl: service.imageUrl,
          features: service.features,
          tags: service.tags,
        }));
        
        categoryServicesRef.current[cacheKey] = formattedServices;
        setCategoryServices(prev => ({ ...prev, [cacheKey]: formattedServices }));
        setIsLoadingServices(prev => ({ ...prev, [cacheKey]: false }));
        return formattedServices;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Failed to load category services from backend:', err);
      categoryServicesRef.current[cacheKey] = [];
      setCategoryServices(prev => ({ ...prev, [cacheKey]: [] }));
      setIsLoadingServices(prev => ({ ...prev, [cacheKey]: false }));
      return [];
    }
  }, []);

  // Get a single service by ID
  const getService = useCallback(async (serviceId) => {
    try {
      const response = await apiService.getService(serviceId, true, true);
      
      if (response.success && response.data && response.data.service) {
        return response.data.service;
      }
      
      throw new Error('Service not found');
    } catch (err) {
      console.error('Failed to get service from backend:', err);
      throw err;
    }
  }, []);

  // Load services on mount
  useEffect(() => {
    loadServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => ({
    services,
    categories,
    categoryServices,
    isLoading,
    isLoadingCategories,
    isLoadingServices,
    error,
    loadServices,
    loadServiceCategories,
    loadCategoryServices,
    getService,
  }), [
    services,
    categories,
    categoryServices,
    isLoading,
    isLoadingCategories,
    isLoadingServices,
    error,
    loadServices,
    loadServiceCategories,
    loadCategoryServices,
    getService,
  ]);

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

