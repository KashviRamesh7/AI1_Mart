import axios from 'axios';
import { io } from 'socket.io-client';

const API = axios.create({ baseURL: '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('ai1mart_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const socket = io('http://localhost:5000', { autoConnect: false });

export default API;
