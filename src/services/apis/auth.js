import apiClient, { setAuthToken, removeAuthToken } from '../api.client.js';

export async function register(email, password, phone = null) {
  const res = await apiClient.post('/v1/auth/register', {
    email,
    password,
    ...(phone && { phone }),
  });
  return res.data;
}

export async function verifyEmail(token) {
  const res = await apiClient.post('/v1/auth/verify-email', { token });
  return res.data;
}

export async function login(email, password) {
  const res = await apiClient.post('/v1/auth/login', { email, password });
  setAuthToken(res.data.accessToken);
  localStorage.setItem('refresh_token', res.data.refreshToken);
  return res.data;
}

export async function logout() {
  await apiClient.post('/v1/auth/logout');
  removeAuthToken();
  localStorage.removeItem('refresh_token');
}

export async function logoutAllDevices() {
  await apiClient.post('/v1/auth/logout-all');
  removeAuthToken();
  localStorage.removeItem('refresh_token');
}

export async function forgotPassword(email) {
  const res = await apiClient.post('/v1/auth/forgot-password', { email });
  return res.data;
}

export async function resetPassword(token, password) {
  const res = await apiClient.post('/v1/auth/reset-password', { token, password });
  return res.data;
}

export async function changePassword(currentPassword, newPassword) {
  const res = await apiClient.post('/v1/auth/change-password', { currentPassword, newPassword });
  return res.data;
}

export async function getMe() {
  const res = await apiClient.get('/v1/auth/me');
  return res.data;
}
