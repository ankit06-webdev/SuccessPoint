import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized! Cookie expired or invalid.');
      
      // You can uncomment this once the cookies are working, 
      // but keeping it commented while debugging is a smart move!
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;