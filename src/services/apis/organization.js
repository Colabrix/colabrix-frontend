import apiClient from '../api.client.js';

export async function createOrganization(name, slug) {
  const res = await apiClient.post('/v1/organizations', { name, slug });
  return res.data;
}

export async function checkSlugAvailability(slug) {
  const res = await apiClient.get('/v1/organizations/check-slug', { params: { slug } });
  return res.data;
}

export async function getOrganizationRoles(organizationId) {
  const res = await apiClient.get(`/v1/organizations/${organizationId}/roles`);
  return res.data;
}
