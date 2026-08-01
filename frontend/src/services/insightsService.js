import apiClient from './apiClient';

export const insightsService = {
  getInsights: async () => {
    const response = await apiClient.get('/insights');
    return response.data;
  },
};

export default insightsService;
