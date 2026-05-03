import md5 from 'md5';

/**
 * Generates a Gravatar URL for a given email address.
 * @param email - The user's email address.
 * @param size - The desired image size (default 200).
 * @returns A string containing the Gravatar URL.
 */
export const getGravatarUrl = (email: string | undefined, size: number = 200): string => {
  const hash = md5(email?.trim().toLowerCase() || '');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;
};
