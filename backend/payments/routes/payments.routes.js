import express from 'express';
import { paymentsModel } from '../models/payments.model.js';

const routerPayments = express.Router();
routerPayments.post('/registro', paymentsModel);