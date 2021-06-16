import express, { Request, Response, NextFunction } from 'express';
export const app = express();

// Allows cross origin requests
import cors from 'cors';
app.use(cors({ origin: true }));



app.use(express.json());

import {createPaymentIntent, confirmAndCaptureOrder, refundPayment} from './payments'

app.post(
  '/createpaymentintent',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(
      await createPaymentIntent(body.amount)
    );
  })
);
app.post (
  '/captureOrder',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(
      await confirmAndCaptureOrder(body)
    );
  })
);
app.post (
  '/refundpayment',
  runAsync(async ({ body }: Request, res: Response) => {
    res.send(
      await refundPayment(body)
    );
  })
);

import {handleStripeWebhook} from './webhooks'
app.post('/hooks', runAsync(handleStripeWebhook))
//helper
function runAsync(callback: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    callback(req, res, next).catch(next);
  };
}

app.use(
  express.json({
    verify: (req, res, buffer) => (req['rawBody'] = buffer),
  })
);