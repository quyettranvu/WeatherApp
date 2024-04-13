import { pool } from '../dbConnection';
import * as jwt from 'jsonwebtoken';

/**
 * Validate email and password formats
 * @param email
 * @param password
 * @returns
 */
export function validateEmailAndPassword(email: string, password: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

  return emailRegex.test(email) && passwordRegex.test(password);
}

/**
 * Find user's credentials with email given
 * @param email
 * @returns
 */
export async function findUserIdForEmail(email: string) {
  try {
    const queryResult = await pool.query(
      'SELECT id FROM users WHERE email = $1 VALUES($1)',
      [email],
    );

    if (queryResult.rows.length > 0) {
      return queryResult.rows[0].id;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Create JWT Token with payload, key, userID given
 * @param payload
 * @param key
 * @param userId
 */
export const createJwtToken = (
  payload: string | object | Buffer,
  key: jwt.Secret,
  userId: string,
) => {
  jwt.sign(payload, key, {
    algorithm: 'RS256',
    expiresIn: '2h',
    subject: userId,
  });
};
