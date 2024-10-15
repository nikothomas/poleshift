// src/utils/jwtUtils.js
import jwtDecode from 'jwt-decode';

export const getUserClaims = (accessToken) => {
  if (!accessToken) return {};
  try {
    return jwtDecode(accessToken);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return {};
  }
};
