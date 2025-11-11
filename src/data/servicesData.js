// Service data structure similar to Urban Company
export const servicesData = {
  electrician: {
    icon: '⚡',
    name: 'Electrician',
    categories: [
      {
        id: 'switch-socket',
        name: 'Switch & socket',
        icon: '🔌',
        services: [
          {
            id: 'switchbox-installation',
            name: 'Switchbox installation',
            description: 'Installed in specified area for new power outlet',
            price: 239,
            duration: 30,
            rating: 4.84,
            reviews: 20000,
          },
          {
            id: 'ac-switchbox-installation',
            name: 'AC switchbox installation',
            description: 'Dedicated switchbox for air conditioner installation',
            price: 249,
            duration: 30,
            rating: 4.83,
            reviews: 13000,
          },
          {
            id: 'switchboard-installation',
            name: 'Switchboard installation',
            description: 'Installed in existing wiring connections within the wall',
            price: 169,
            duration: 30,
            rating: 4.81,
            reviews: 20000,
          },
          {
            id: 'socket-repair',
            name: 'Socket repair',
            description: 'Repair and replacement of damaged sockets',
            price: 199,
            duration: 30,
            rating: 4.80,
            reviews: 15000,
          },
        ],
      },
      {
        id: 'fan',
        name: 'Fan',
        icon: '🌀',
        services: [
          {
            id: 'ceiling-fan-installation',
            name: 'Ceiling fan installation',
            description: 'Installation of new ceiling fan with wiring',
            price: 399,
            duration: 60,
            rating: 4.85,
            reviews: 18000,
          },
          {
            id: 'fan-repair',
            name: 'Fan repair',
            description: 'Repair of faulty ceiling or table fan',
            price: 299,
            duration: 45,
            rating: 4.82,
            reviews: 12000,
          },
          {
            id: 'fan-service',
            name: 'Fan service',
            description: 'Cleaning and maintenance of ceiling fan',
            price: 199,
            duration: 30,
            rating: 4.79,
            reviews: 10000,
          },
        ],
      },
      {
        id: 'wall-ceiling-light',
        name: 'Wall/ceiling light',
        icon: '💡',
        services: [
          {
            id: 'ceiling-light-installation',
            name: 'Ceiling light installation',
            description: 'Installation of LED or bulb light fixtures on ceiling',
            price: 299,
            duration: 45,
            rating: 4.86,
            reviews: 22000,
          },
          {
            id: 'wall-light-installation',
            name: 'Wall light installation',
            description: 'Installation of decorative wall lights',
            price: 349,
            duration: 45,
            rating: 4.84,
            reviews: 15000,
          },
          {
            id: 'light-repair',
            name: 'Light repair',
            description: 'Repair and replacement of faulty lights',
            price: 249,
            duration: 30,
            rating: 4.81,
            reviews: 18000,
          },
        ],
      },
      {
        id: 'wiring',
        name: 'Wiring',
        icon: '🔌',
        services: [
          {
            id: 'house-wiring',
            name: 'House wiring',
            description: 'Complete electrical wiring for new house',
            price: 4999,
            duration: 480,
            rating: 4.87,
            reviews: 8000,
          },
          {
            id: 'rewiring',
            name: 'Rewiring',
            description: 'Complete rewiring of existing house',
            price: 3999,
            duration: 360,
            rating: 4.85,
            reviews: 6000,
          },
          {
            id: 'wire-repair',
            name: 'Wire repair',
            description: 'Repair of damaged or faulty wires',
            price: 499,
            duration: 60,
            rating: 4.83,
            reviews: 10000,
          },
        ],
      },
      {
        id: 'doorbell',
        name: 'Doorbell',
        icon: '🔔',
        services: [
          {
            id: 'doorbell-installation',
            name: 'Doorbell installation',
            description: 'Installation of new doorbell system',
            price: 399,
            duration: 45,
            rating: 4.82,
            reviews: 5000,
          },
          {
            id: 'doorbell-repair',
            name: 'Doorbell repair',
            description: 'Repair of faulty doorbell',
            price: 299,
            duration: 30,
            rating: 4.80,
            reviews: 4000,
          },
        ],
      },
      {
        id: 'mcb-submeter',
        name: 'MCB & submeter',
        icon: '⚡',
        services: [
          {
            id: 'mcb-installation',
            name: 'MCB installation',
            description: 'Installation of miniature circuit breaker',
            price: 599,
            duration: 60,
            rating: 4.86,
            reviews: 12000,
          },
          {
            id: 'submeter-installation',
            name: 'Submeter installation',
            description: 'Installation of electrical submeter',
            price: 799,
            duration: 90,
            rating: 4.84,
            reviews: 8000,
          },
        ],
      },
      {
        id: 'inverter-stabiliser',
        name: 'Inverter & stabiliser',
        icon: '🔋',
        services: [
          {
            id: 'inverter-installation',
            name: 'Inverter installation',
            description: 'Installation of home inverter system',
            price: 1299,
            duration: 120,
            rating: 4.85,
            reviews: 7000,
          },
          {
            id: 'stabiliser-installation',
            name: 'Stabiliser installation',
            description: 'Installation of voltage stabiliser',
            price: 899,
            duration: 90,
            rating: 4.83,
            reviews: 5000,
          },
        ],
      },
      {
        id: 'appliance',
        name: 'Appliance',
        icon: '📱',
        services: [
          {
            id: 'appliance-repair',
            name: 'Appliance repair',
            description: 'Repair of electrical appliances',
            price: 399,
            duration: 60,
            rating: 4.81,
            reviews: 15000,
          },
          {
            id: 'appliance-installation',
            name: 'Appliance installation',
            description: 'Installation of electrical appliances',
            price: 499,
            duration: 60,
            rating: 4.84,
            reviews: 12000,
          },
        ],
      },
      {
        id: 'consultation',
        name: 'Book a consultation',
        icon: '👨‍💼',
        services: [],
      },
    ],
  },
  plumber: {
    icon: '🔧',
    name: 'Plumber',
    categories: [
      {
        id: 'leak-repair',
        name: 'Leak repair',
        icon: '💧',
        services: [
          {
            id: 'tap-leak-repair',
            name: 'Tap leak repair',
            description: 'Fix leaking taps and faucets',
            price: 299,
            duration: 30,
            rating: 4.85,
            reviews: 18000,
          },
          {
            id: 'pipe-leak-repair',
            name: 'Pipe leak repair',
            description: 'Fix leaking pipes and connections',
            price: 399,
            duration: 45,
            rating: 4.83,
            reviews: 15000,
          },
        ],
      },
      {
        id: 'installation',
        name: 'Installation',
        icon: '🔩',
        services: [
          {
            id: 'tap-installation',
            name: 'Tap installation',
            description: 'Installation of new taps and faucets',
            price: 399,
            duration: 45,
            rating: 4.86,
            reviews: 20000,
          },
          {
            id: 'shower-installation',
            name: 'Shower installation',
            description: 'Installation of shower systems',
            price: 599,
            duration: 60,
            rating: 4.84,
            reviews: 12000,
          },
        ],
      },
    ],
  },
  cleaner: {
    icon: '🧹',
    name: 'Cleaner',
    categories: [
      {
        id: 'deep-cleaning',
        name: 'Deep cleaning',
        icon: '🏠',
        services: [
          {
            id: 'home-deep-cleaning',
            name: 'Home deep cleaning',
            description: 'Complete deep cleaning of entire home',
            price: 1999,
            duration: 240,
            rating: 4.88,
            reviews: 25000,
          },
          {
            id: 'office-cleaning',
            name: 'Office cleaning',
            description: 'Deep cleaning of office space',
            price: 2499,
            duration: 300,
            rating: 4.85,
            reviews: 15000,
          },
        ],
      },
    ],
  },
  painter: {
    icon: '🎨',
    name: 'Painter',
    categories: [
      {
        id: 'interior-painting',
        name: 'Interior painting',
        icon: '🖼️',
        services: [
          {
            id: 'room-painting',
            name: 'Room painting',
            description: 'Complete painting of room interior',
            price: 2999,
            duration: 480,
            rating: 4.87,
            reviews: 20000,
          },
        ],
      },
    ],
  },
  chef: {
    icon: '👨‍🍳',
    name: 'Chef',
    categories: [
      {
        id: 'home-chef',
        name: 'Home chef service',
        icon: '🍳',
        services: [
          {
            id: 'home-chef-service',
            name: 'Home chef service',
            description: 'Professional chef service at your home',
            price: 1999,
            duration: 180,
            rating: 4.89,
            reviews: 15000,
          },
        ],
      },
    ],
  },
  'more-services': {
    icon: '🔍',
    name: 'More Services',
    categories: [
      {
        id: 'carpenter',
        name: 'Carpenter',
        icon: '🪚',
        services: [
          {
            id: 'furniture-repair',
            name: 'Furniture repair',
            description: 'Repair and restoration of furniture',
            price: 599,
            duration: 120,
            rating: 4.82,
            reviews: 8000,
          },
        ],
      },
      {
        id: 'ac-repair',
        name: 'AC Repair',
        icon: '❄️',
        services: [
          {
            id: 'ac-service',
            name: 'AC service',
            description: 'Complete AC servicing and maintenance',
            price: 799,
            duration: 90,
            rating: 4.85,
            reviews: 12000,
          },
        ],
      },
      {
        id: 'pest-control',
        name: 'Pest Control',
        icon: '🐛',
        services: [
          {
            id: 'pest-control-service',
            name: 'Pest control service',
            description: 'Professional pest control treatment',
            price: 999,
            duration: 120,
            rating: 4.83,
            reviews: 10000,
          },
        ],
      },
      {
        id: 'gardening',
        name: 'Gardening',
        icon: '🌱',
        services: [
          {
            id: 'garden-maintenance',
            name: 'Garden maintenance',
            description: 'Complete garden maintenance and care',
            price: 699,
            duration: 120,
            rating: 4.80,
            reviews: 6000,
          },
        ],
      },
    ],
  },
};

// Get all main services
export const getMainServices = () => {
  return Object.keys(servicesData).map(key => ({
    id: key,
    icon: servicesData[key].icon,
    name: servicesData[key].name,
  }));
};

// Get categories for a service
export const getServiceCategories = (serviceId) => {
  return servicesData[serviceId]?.categories || [];
};

// Get services for a category
export const getCategoryServices = (serviceId, categoryId) => {
  const category = servicesData[serviceId]?.categories?.find(cat => cat.id === categoryId);
  return category?.services || [];
};

