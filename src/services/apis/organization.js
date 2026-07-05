import apiClient from '../api.client.js';

export async function createOrganization(name, slug) {
  const res = await apiClient.post('/v1/organizations', { name, slug });
  return res.data;
}
