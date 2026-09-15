export function resolveOrgDestination(organizations) {
  if (!organizations || organizations.length === 0) return '/get-started';

  if (organizations.length === 1) {
    return `/org/${organizations[0].organization.slug}/dashboard`;
  }

  return '/org/select';
}
