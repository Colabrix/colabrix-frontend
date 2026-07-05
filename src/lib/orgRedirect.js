export function resolveOrgDestination(organizations, lastActiveSlug) {
  if (!organizations || organizations.length === 0) return '/get-started';

  if (organizations.length === 1) {
    return `/org/${organizations[0].organization.slug}/dashboard`;
  }

  const remembered =
    lastActiveSlug &&
    organizations.find((membership) => membership.organization.slug === lastActiveSlug);

  if (remembered) {
    return `/org/${remembered.organization.slug}/dashboard`;
  }

  return '/org/select';
}
