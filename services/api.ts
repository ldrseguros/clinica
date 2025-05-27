import axios from 'axios';
import { API_BASE_URL } from '../constants';
import { User } from '../types';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Mock Authentication API Calls ---
// Replace these with actual backend calls when the backend is ready.

interface LoginResponse {
  token: string;
  user: User;
}

export const loginUserApi = async (email: string, password: string): Promise<LoginResponse> => {
  console.log(`Attempting login for: ${email}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock backend validation
  if (email === 'admin@clinicadpvoce.com.br' && password === 'password123') {
    const mockToken = 'fake-jwt-token-' + Date.now();
    const mockUser: User = {
      id: 'admin-user-id',
      email: 'admin@clinicadpvoce.com.br',
      name: 'Administrador',
      role: 'ADMIN',
    };
    console.log('Mock login successful for admin');
    return { token: mockToken, user: mockUser };
  } else if (email === 'user@example.com' && password === 'password') {
     const mockToken = 'fake-jwt-token-user-' + Date.now();
    const mockUser: User = {
      id: 'user-id-123',
      email: 'user@example.com',
      name: 'Usuário Comum',
      role: 'USER',
    };
    console.log('Mock login successful for user');
    return { token: mockToken, user: mockUser };
  }
  else {
    // Removed console.log('Mock login failed');
    throw new Error('Credenciais inválidas (mock)');
  }
};

interface RegisterResponse {
  message: string;
  user?: User; // User might not be returned, or just an ID/email
}

export const registerUserApi = async (name: string, email: string, password: string): Promise<RegisterResponse> => {
  console.log(`Attempting registration for: ${name}, ${email}`);
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock backend behavior
  if (email === 'exists@example.com') {
    console.log('Mock registration failed: email exists');
    throw new Error('Este email já está cadastrado (mock).');
  }

  const mockUser: User = {
    id: 'new-user-' + Date.now(),
    email: email,
    name: name,
    role: 'USER'
  };
  console.log('Mock registration successful');
  return { message: 'Usuário cadastrado com sucesso (mock)!', user: mockUser };
};


// Placeholder for fetching user profile if token exists but user object is not in AuthContext
export const fetchUserProfileApi = async (/* token: string */): Promise<User> => {
  // This function would be called by AuthContext to validate a token and get user data
  // For now, let's assume it's part of the login response or not needed for this demo stage
  console.log('Fetching user profile (mock)');
  await new Promise(resolve => setTimeout(resolve, 500));
  // This user data should ideally come from decoding the JWT on the frontend (if safe)
  // or a dedicated backend call.
  const mockUser: User = {
    id: 'fetched-user-id',
    email: 'admin@clinicadpvoce.com.br', // Or email from token
    name: 'Usuário Logado',
    role: 'ADMIN', // Or role from token
  };
  return mockUser;
};


// Example of how other API calls would be structured:
/*
export const getPatientsApi = async () => {
  const response = await apiClient.get('/patients');
  return response.data;
};

export const createPatientApi = async (patientData: Partial<Patient>) => {
  const response = await apiClient.post('/patients', patientData);
  return response.data;
};
*/

export default apiClient;