import { Request, Response } from 'express';
import { pool } from '../dbConnection';
import { createJwtToken, findUserIdForEmail } from './helperFunctions';
import bcrypt from 'bcrypt';

const RSA_PRIVATE_KEY: any = process.env.RSA_PRIVATE_KEY;

export const signUpRoute = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    let userId = await findUserIdForEmail(email);
    if (userId) {
      res.status(400).send('Email already existed');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const queryResult = await pool.query(
      'INSERT INTO users(email) VALUES($1, $2) RETURNING id',
      [email, hashedPassword],
    );

    userId = queryResult.rows[0].id;
    const jwtBearerToken = createJwtToken({}, RSA_PRIVATE_KEY, userId);

    /* Ways to send JWT back to user */
    // Saving JWT in Cookie
    //res.status(200).cookie("SESSIONID", jwtBearerToken, {httpOnly:true, secure:true});

    // Send JWT back to client
    res.status(200).json({
      idToken: jwtBearerToken,
      expiresIn: '2h',
      message: 'User registered successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

export const loginRoute = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const userId = await findUserIdForEmail(email);
    if (!userId) {
      res.status(400).send('Email does not exist');
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

    const jwtBearerToken = createJwtToken({}, RSA_PRIVATE_KEY, userId);

    res.status(200).json({
      idToken: jwtBearerToken,
      expiresIn: '2h',
      message: 'User logged in successfully!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};
