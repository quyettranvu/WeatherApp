import express from 'express';
import {
  createPlanRoute,
  getListPlansRoute,
  loginRoute,
  signUpRoute,
} from './handlerFunctions';

export const customRoutes = express.Router();

customRoutes.post('/signup', signUpRoute);
customRoutes.post('/login', loginRoute);
customRoutes.post('/create-plan', createPlanRoute);
customRoutes.get('/list-plan', getListPlansRoute);
