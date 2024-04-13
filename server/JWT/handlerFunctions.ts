import { Request, Response } from 'express';
import { pool } from '../dbConnection';
import { generateJwtToken, findUserIdForEmail } from './helperFunctions';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/* Using HS256 */
export const ACCESS_PRIVATE_KEY: any = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_PRIVATE_KEY: any = process.env.REFRESH_TOKEN_SECRET;
const refreshTokens: string | any[] = [];

export const signUpRoute = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    let userId = await findUserIdForEmail(email);
    if (userId) {
      res.status(400).send('Email already existed');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const queryResult = await pool.query(
      'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id',
      [email, hashedPassword],
    );

    userId = queryResult.rows[0].id;

    const accessToken = generateJwtToken({ userId }, ACCESS_PRIVATE_KEY);
    const refreshToken = generateJwtToken({ userId }, REFRESH_PRIVATE_KEY);
    console.log(accessToken, refreshToken);
    refreshTokens.push(refreshToken);

    /* Ways to send JWT back to user */
    // Saving JWT in Cookie
    //res.status(200).cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});

    // Send JWT back to client
    return res.status(200).json({
      idToken: accessToken,
      idRefreshToken: refreshToken,
      expiresIn: '2h',
      message: 'User registered successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
    return;
  }
};

export const loginRoute = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userId = await findUserIdForEmail(email);
    if (!userId) {
      res.status(400).send('Email does not exist');
      return;
    }

    const queryResult = await pool.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    const passwordMatched = await bcrypt.compare(
      password,
      queryResult.rows[0].password,
    );

    if (!passwordMatched) {
      res.status(400).send('Invalid password');
    }

    const accessToken = generateJwtToken({ userId }, ACCESS_PRIVATE_KEY);
    const refreshToken = generateJwtToken({ userId }, REFRESH_PRIVATE_KEY);
    refreshTokens.push(refreshToken);

    return res.status(200).json({
      idToken: accessToken,
      idRefreshToken: refreshToken,
      expiresIn: '2h',
      message: 'User logged in successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
    return;
  }
};

export const logoutRoute = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).send('No refreshToken provided');
    return;
  }

  const index = refreshTokens.indexOf(refreshToken);
  if (index !== -1) {
    refreshTokens.splice(index, 1);
  }

  res.status(204).send('Log out successfully!');
  return;
};

export const authMiddleware = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send('No Authorization header provided');
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, ACCESS_PRIVATE_KEY, (error: any, user_decoded: any) => {
    if (error) {
      return res.status(401).send('Invalid token');
    }
    console.log('Verified with creditials: ', user_decoded);
    // req = decoded;
    next();
  });
};

export const generateTokens = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    res.status(403).send('Invalid refresh token');
    return;
  }

  jwt.verify(
    refreshToken,
    REFRESH_PRIVATE_KEY,
    (error: any, user_decoded: any) => {
      if (error) {
        return res.status(403).send('Invalid refresh token');
      }

      const accessToken = generateJwtToken(user_decoded, ACCESS_PRIVATE_KEY);
      return res.status(200).json({ accessToken });
    },
  );
};
