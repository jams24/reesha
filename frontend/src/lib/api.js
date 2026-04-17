import axios from 'axios';
import { getToken } from './auth.js';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function fetchProducts(params = {}) {
  const { data } = await api.get('/products', { params });
  return data;
}

export async function fetchProductBySlug(slug) {
  const { data } = await api.get(`/products/${slug}`);
  return data;
}

export async function createProduct(formData) {
  const { data } = await api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateProduct(id, formData) {
  const { data } = await api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}

export async function loginAdmin(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
}
