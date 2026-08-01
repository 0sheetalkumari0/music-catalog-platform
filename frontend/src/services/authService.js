import apiClient from './apiClient';

export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
    }
    return response.data;
  },

  register: async (username, password) => {
    const response = await apiClient.post('/auth/register', { username, password });
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },

  getCurrentUser: () => {
    return {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
    };
  },
};

export default authService;
