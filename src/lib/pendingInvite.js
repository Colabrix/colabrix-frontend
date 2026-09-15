const PENDING_INVITE_KEY = 'pending_invite_token';

export function savePendingInvite(token) {
  localStorage.setItem(PENDING_INVITE_KEY, token);
}

export function consumePendingInvite() {
  const token = localStorage.getItem(PENDING_INVITE_KEY);
  if (token) localStorage.removeItem(PENDING_INVITE_KEY);
  return token;
}

export function extractInviteToken(input) {
  const trimmed = input.trim();
  if (!trimmed) return '';

  const match = trimmed.match(/\/invite\/([^/?#]+)/);
  if (match) return match[1];

  return trimmed;
}
