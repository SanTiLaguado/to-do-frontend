import axios from 'axios';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const API_LOGIN_URL = `${apiUrl}/auth/login`;
const API_REGISTER_URL = `${apiUrl}/auth/register`;

interface UserData {
  email: string;
}

interface LoginResponse {
  token: string;
  email: string
}

export const login = async (email: string, password: string): Promise<{ token: string }> => {
  try {
    const response = await axios.post<LoginResponse>(API_LOGIN_URL, { email, password });
    const { token, email: serverEmail } = response.data;

    if (typeof window !== "undefined") {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ email: serverEmail }));
    }

    return { token };
  } catch (error: any) {
    console.error('Error logging in:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

export const register = async (
  nombre: string,
  email: string,
  password: string
): Promise<void> => {
  try {
    await axios.post(API_REGISTER_URL, { email, password, nombre });
    
    if (typeof window !== "undefined") {
      localStorage.removeItem('token');
    }
  } catch (error: any) {
    console.error('Error registering:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  }
};

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem('token');
  }
  return null;
};

export const getUserInfo = (): UserData | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) as UserData : null;
  }
  return null;
};
