import { Request, Response } from 'express';
import { pool } from '../dbConnection';
import { generateJwtToken, findUserIdForEmail } from './helperFunctions';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cron from 'node-cron';
import moment from 'moment';

/* Authorization, Authentication, JWT tokens, refreshtoken for regenerating accesstoken, pass interceptor, opinions about ideas of using 2 types of tokens */
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
    refreshTokens.push(refreshToken);

    /* Ways to send JWT back to user */
    // Saving JWT in Cookie
    //res.status(200).cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});

    // Send JWT back to client
    return res.status(200).json({
      idToken: accessToken,
      idRefreshToken: refreshToken,
      expiresIn: '2',
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

    const user = queryResult.rows[0];
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

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

    //Check user's plan feature
    checkStillValidPlan(email);

    return res.status(200).json({
      user: userWithoutPassword,
      idToken: accessToken,
      idRefreshToken: refreshToken,
      expiresIn: '2',
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

export const generateAccessTokenWithRefreshToken = (
  req: Request,
  res: Response,
) => {
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

/* Subscription feature */
export const createPlanRoute = async (req: Request, res: Response) => {
  try {
    const { price, name, userId } = req.body;

    if (!price || !name || !userId) {
      return res.status(400).json('All fields are required!');
    }

    const queryResult = await pool.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    const user = queryResult.rows[0];
    if (user.isProMember) {
      return res
        .status(400)
        .json('You are already pro member! Not allowed to register again!');
    }

    // const _expected_body = _.pick(req.body, ['price', 'name']);
    const queryPlanResult = await pool.query(
      'INSERT INTO plan(price, name, userId) VALUES($1, $2, $3) RETURNING id',
      [price, name, userId],
    );

    if (queryPlanResult) {
      return res.status(200).json('Successfully registered as pro member ^^!');
    }
    res.json(400).send('Oops! Something went wrong!');
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
    return;
  }
};

export const getListPlansRoute = async (req: Request, res: Response) => {
  try {
    const queryResult = await pool.query('SELECT * FROM plan');
    if (queryResult.rows.length == 0) {
      return res
        .status(200)
        .json('Sorry! There are no current available plans :(');
    }
    return res.status(200).json(queryResult.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
    return;
  }
};

export function checkStillValidPlan(email: string) {
  cron.schedule('* * * * *', async function () {
    const today_date = moment(new Date()).format('YYYY-MM-DD hh:mm');
    const userId = await findUserIdForEmail(email);
    if (!userId) {
      console.error('Email does not exist');
    }

    const queryResult = await pool.query('SELECT * FROM users WHERE id = $1', [
      userId,
    ]);

    const user = queryResult.rows[0];
    const userDueDate = moment(user.valid_date).format('YYYY-MM-DD hh:mm');

    if (today_date === userDueDate) {
      await pool.query('UPDATE users SET isProMember = false WHERE id = $1', [
        user.id,
      ]);
    }
  });
}
