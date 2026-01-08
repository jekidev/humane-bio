import Stripe from 'stripe';
import { ENV } from './_core/env';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function createCheckoutSession(
  userId: number,
  userEmail: string,
  userName: string,
  cartItems: Array<{ productId: number; quantity: number; price: number }>,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Product ${item.productId}`,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: userEmail,
      client_reference_id: userId.toString(),
      metadata: {
        user_id: userId.toString(),
        customer_email: userEmail,
        customer_name: userName,
      },
      allow_promotion_codes: true,
    });

    return session;
  } catch (error) {
    console.error('[Stripe] Failed to create checkout session:', error);
    throw error;
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('[Stripe] Failed to retrieve checkout session:', error);
    throw error;
  }
}

export async function getPaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('[Stripe] Failed to retrieve payment intent:', error);
    throw error;
  }
}

export async function createCustomer(email: string, name?: string) {
  try {
    return await stripe.customers.create({
      email,
      name,
    });
  } catch (error) {
    console.error('[Stripe] Failed to create customer:', error);
    throw error;
  }
}

export { stripe };
