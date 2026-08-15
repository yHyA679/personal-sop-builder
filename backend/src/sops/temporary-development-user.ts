// TODO(auth): Replace this user with the authenticated JWT user once authentication is implemented.
export const TEMPORARY_DEVELOPMENT_USER = {
  fullName: 'Development User',
  email: 'development@personal-sop-builder.local',
  passwordHash: 'development-only-no-password',
} as const;
