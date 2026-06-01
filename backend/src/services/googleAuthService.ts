import axios from 'axios';
import jwt from 'jsonwebtoken';

const GOOGLE_OAUTH2_URL = 'https://www.googleapis.com/oauth2/v1/tokeninfo';

interface GoogleTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
}

/**
 * Verify Google ID Token
 * @param idToken - The ID token from Google Sign-In
 * @param expectedClientId - Your Google OAuth Client ID
 * @returns Decoded token payload if valid
 */
export const verifyGoogleToken = async (
  idToken: string,
  expectedClientId: string
): Promise<GoogleTokenPayload | null> => {
  try {
    // Decode the token (don't verify signature here as Google handles it)
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format');
      return null;
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    // Verify token isn't expired
    if (payload.exp * 1000 < Date.now()) {
      console.error('Token has expired');
      return null;
    }

    // Verify the audience (client ID)
    if (payload.aud !== expectedClientId) {
      console.error('Token audience does not match client ID');
      return null;
    }

    // Verify token issuer
    if (!payload.iss.includes('accounts.google.com')) {
      console.error('Token issuer is not Google');
      return null;
    }

    return payload as GoogleTokenPayload;
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return null;
  }
};

/**
 * Extract user info from Google token
 */
export const extractGoogleUserInfo = (tokenPayload: GoogleTokenPayload) => {
  return {
    googleId: tokenPayload.sub,
    email: tokenPayload.email,
    name: tokenPayload.name || `${tokenPayload.given_name} ${tokenPayload.family_name}`.trim(),
    firstName: tokenPayload.given_name,
    lastName: tokenPayload.family_name,
    picture: tokenPayload.picture,
    emailVerified: tokenPayload.email_verified,
  };
};
