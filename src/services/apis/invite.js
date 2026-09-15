import apiClient from '../api.client.js';

export async function validateInvite(token) {
  const res = await apiClient.get(`/v1/invites/${token}/validate`);
  return res.data;
}

export async function acceptInvite(token) {
  const res = await apiClient.post(`/v1/invites/${token}/accept`);
  return res.data;
}

export async function generateInvite(organizationId, payload) {
  const res = await apiClient.post(`/v1/invites/organizations/${organizationId}`, payload);
  return res.data;
}

export async function getOrganizationInvites(organizationId) {
  const res = await apiClient.get(`/v1/invites/organizations/${organizationId}`);
  return res.data;
}

export async function revokeInvite(inviteId) {
  const res = await apiClient.delete(`/v1/invites/${inviteId}`);
  return res.data;
}
