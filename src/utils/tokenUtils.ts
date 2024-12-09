import Cookies from "js-cookie";

// Cookie names
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Sets the access and refresh tokens in cookies.
 * @param accessToken - The JWT access token.
 * @param refreshToken - The JWT refresh token.
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  // Set access token (expires in 15 minutes)
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 15 / (24 * 60) });

  // Set refresh token (expires in 7 days)
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7 });
};

/**
 * Gets the access token from cookies.
 * @returns The access token or null if not found.
 */
export const getAccessToken = (): string | null => {
  return Cookies.get(ACCESS_TOKEN_KEY) || null;
};

/**
 * Gets the refresh token from cookies.
 * @returns The refresh token or null if not found.
 */
export const getRefreshToken = (): string | null => {
  return Cookies.get(REFRESH_TOKEN_KEY) || null;
};

/**
 * Clears the access and refresh tokens from cookies.
 */
export const clearTokens = (): void => {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
};
