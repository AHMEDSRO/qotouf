export interface Dictionary {
  brand: string;
  nav: {
    vegetables: string;
    fruits: string;
    wholesale: string;
    search: string;
    cart: string;
    account: string;
    login: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
  };
  footer: {
    rights: string;
    deliveryPolicy: string;
    returnPolicy: string;
    terms: string;
    privacy: string;
  };
  common: {
    languageToggle: string;
  };
}

const en: Dictionary = {
  brand: 'Qutoof',
  nav: {
    vegetables: 'Vegetables',
    fruits: 'Fruits',
    wholesale: 'Wholesale',
    search: 'Search',
    cart: 'Cart',
    account: 'Account',
    login: 'Log in',
  },
  home: {
    heroTitle: 'Fresh vegetables & fruit, delivered across the UAE',
    heroSubtitle: 'Retail and wholesale, on one platform.',
  },
  footer: {
    rights: 'All rights reserved.',
    deliveryPolicy: 'Delivery Policy',
    returnPolicy: 'Return Policy',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
  },
  common: {
    languageToggle: 'العربية',
  },
};

export default en;
