import express from 'express';
import { loginRoute, signUpRoute } from './handlerFunctions';

export const authRoutes = express.Router();

authRoutes.post('/signup', signUpRoute);
authRoutes.post('/login', loginRoute);
