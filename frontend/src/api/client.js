import axios from 'axios';

// Use environment variable for deployment, fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  checkHealth: async () => {
    try {
      const response = await client.get('/health');
      return response.data;
    } catch (error) {
      console.error('API Health Check Failed:', error);
      throw error;
    }
  },

  analyzeFace: async (imageFile) => {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await client.post('/analyze-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Face Analysis Failed:', error);
      throw error;
    }
  },

  recommendOutfits: async (description, genderFilter = null, topN = 10) => {
    const formData = new FormData();
    formData.append('description', description);
    if (genderFilter) formData.append('gender_filter', genderFilter);
    formData.append('top_n', topN);

    try {
      const response = await client.post('/recommend-outfits', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Endpoint uses Form(...)
        }
      });
      return response.data;
    } catch (error) {
      console.error('Recommendation Failed:', error);
      throw error;
    }
  },

  generateTryOn: async (imageFile, description) => {
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('description', description);

    try {
      const response = await client.post('/generate-try-on', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Virtual Try-On Failed:', error);
      throw error;
    }
  },

  getGeneratedImageUrl: (filename) => {
    // filename coming from API, e.g. /static/output_123.png
    return `${API_URL}${filename}`;
  }
};

export default api;
