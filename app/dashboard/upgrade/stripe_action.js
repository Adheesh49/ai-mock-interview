// File: app/dashboard/upgrade/stripe_action.js
'use server';

import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server'; // Or your auth provider

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createStripeCheckoutSession() {
  const user = await currentUser();
  if (!user) {
    return { error: 'You must be logged in to upgrade.' };
  }

  const userEmail = user.primaryEmailAddress.emailAddress;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID, // The ID of the price you created in Stripe
          quantity: 1,
        },
      ],
      mode: 'subscription', // Use 'payment' for one-time purchases
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/upgrade?upgrade=cancelled`,
      customer_email: userEmail, // Pre-fill the customer's email
    });

    // Return the session ID, which we'll use to redirect the user
    return { sessionId: session.id };

  } catch (error) {
    console.error("Stripe Error:", error.message);
    return { error: 'Could not create a checkout session. Please try again.' };
  }
}