import { config } from "dotenv";
if (process.env.NODE_ENV !== 'production') {
    config();
}
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
// Initialize Stripe
import Stripe from 'stripe'; 
const cron = require('node-cron');
export const stripe = new Stripe(process.env.STRIPE_SECRET, { 
    
    apiVersion: '2020-08-27',
});
export const dbApi = process.env.DB_API;
export const Username = process.env.API_USERNAME;
export const Password = process.env.API_PASSWORD;
export const paypalApi = process.env.PAYPAL_API;
export const paypalAuthToken = process.env.PAYPAL_AUTH_TOKEN;

import { app } from './api';
const port = process.env.PORT || 3333;

import {getAuthToken} from './authorize'

app.listen(port, async () =>
{
    getAuthToken();

    const authTask = cron.schedule('*/59 * * * *', () => {
        getAuthToken().then( result =>
            console.log( result )
        )
    });
    authTask.start();
 console.log(`API available on http://localhost:${port}`)  
}

 
 
 );

