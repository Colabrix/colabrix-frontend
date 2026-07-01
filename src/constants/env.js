export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5001';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';
export const IS_DEV = APP_ENV === 'development';
