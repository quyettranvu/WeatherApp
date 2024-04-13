import express from 'express';
import { loginRoute, signUpRoute } from './handlerFunctions';

export const apiRoutes = express.Router();

apiRoutes.post('/signup', signUpRoute);
apiRoutes.post('/login', loginRoute);
