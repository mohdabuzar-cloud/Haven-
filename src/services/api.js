import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Default JSON content-type if not already set and data is not FormData
  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
  if (!isFormData && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  // Debug: log request
  console.log(`Request to ${endpoint} with payload:`, config.data);

  try {
    const response = await axios({ url, ...config });

    // Axios already parses JSON; for non-JSON responses, response.data is a string
    return response.data;
  } catch (error) {
    // Axios throws for non-2xx responses; extract the server message
    const message = error.response?.data?.message || error.response?.data || error.message;
    console.error('API Error:', message);
    throw new Error(message || 'API request failed');
  }
};

// Auth API functions
export const authAPI = {
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    data: userData,
  }),
  
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    data: credentials,
  }),
  
  getCurrentUser: () => apiCall('/auth/me'),
};

// Onboarding API functions
export const onboardingAPI = {
  updateEligibility: (field, value) => apiCall('/onboarding/eligibility', {
    method: 'PUT',
    data: { field, value },
  }),
  
  updateDetails: (details) => apiCall('/onboarding/details', {
    method: 'PUT',
    data: details,
  }),
  
  submitVerification: () => apiCall('/onboarding/submit-verification', {
    method: 'POST',
  }),
  
  getStatus: () => apiCall('/onboarding/status'),
  
  uploadDocument: (docType, file) => {
    const form = new FormData();
    form.append('file', file);
    return apiCall(`/onboarding/documents/${docType}`, {
      method: 'POST',
      data: form,
      headers: {},
    });
  },
};
