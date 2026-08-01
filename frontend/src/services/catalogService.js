import apiClient from './apiClient';

export const catalogService = {
  search: async (query, type = 'album', limit = 25) => {
    const response = await apiClient.get('/search', {
      params: { query, type, limit },
    });
    return response.data;
  },
};

export default catalogService;
