import apiClient from './apiClient';

export const libraryService = {
  getLibrary: async () => {
    const response = await apiClient.get('/library');
    return response.data;
  },

  getLibraryPaged: async (page = 0, size = 10, sortBy = 'createdAt', direction = 'DESC') => {
    const response = await apiClient.get('/library/page', {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  },

  saveAlbum: async (albumData) => {
    const response = await apiClient.post('/library', albumData);
    return response.data;
  },

  updateAlbum: async (id, albumData) => {
    const response = await apiClient.put(`/library/${id}`, albumData);
    return response.data;
  },

  deleteAlbum: async (id) => {
    const response = await apiClient.delete(`/library/${id}`);
    return response.data;
  },
};

export default libraryService;
