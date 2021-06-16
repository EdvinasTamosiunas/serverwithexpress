import {stripe} from './'
import axios from 'axios'
import {dbApi, paypalApi, paypalAuthToken} from './index'
import {returnAuthToken} from './authorize'

export async function createPaymentIntent(amount: number ){
    const PaymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "eur"
    })
    return PaymentIntent;
}

export async function confirmAndCaptureOrder(order){

        try{
          const result = await axios.post(dbApi+'/Order', order, {
        headers:
            {'Authorization': `Bearer ${returnAuthToken()}`}
        });
        return result.data;
        }catch(error){
            return error;
        }  
}
async function captureRefundPayment(paymentId: string){
     
    try{
        const result = await axios.post(dbApi+'/Payment/refund/'+paymentId, {},{
      headers:
          {'Authorization': `Bearer ${returnAuthToken()}`}
      });
      return result.data;
      }catch(error){
          return error;
      }  
    
}

export async function refundPayment(order){
    if(order.payment.paymentMethod==='stripe'){
        const refund = await refundStripePayment(order)
        await captureRefundPayment(order.payment.id)
        console.log(order.payment.id)
        return refund
    }
    
    else if(order.payment.paymentMethod==='paypal'){
        const refund = await refundPaypalPayment(order)
        await captureRefundPayment(order.payment.id)
        return refund
    }
    
    const err = Error();
    err.message = "Invalid payment method"
    return err;
}

async function refundStripePayment(order){
    try {
       const payment_intent = await stripe.paymentIntents.retrieve(
        order.payment.gatewayId
    )
    let id = "";
    payment_intent.charges.data.forEach(charge => {
        id = charge.id;
    });
    const Refund = await stripe.refunds.create({
        charge: id
    })

    return Refund 
    } catch (error) {
    return error;
    }
}

async function refundPaypalPayment(order){
    try {
        const Refund = await axios.post(paypalApi+'/payments/capture/'+order.payment.gatewayId+'/refund', {}, {
        headers: 
            {'Authorization': `Bearer ${paypalAuthToken}`}
        
    })
    return Refund;
    } catch (error) {
    return error;
    }
}