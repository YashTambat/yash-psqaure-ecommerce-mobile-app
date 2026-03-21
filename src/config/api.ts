const fallbackApiUrl = 'https://yash-psqaure-ecommerce-mobile-app-backend.onrender.com/api';

const normalizedApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, '') || fallbackApiUrl;

export const Api = {
  url: normalizedApiUrl,
  auth: {
    login: `${normalizedApiUrl}/auth/login`,
    register: `${normalizedApiUrl}/auth/signup`,
  },
};
