import { Request, Response } from 'express';
import Stripe from 'stripe';
import db from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
apiVersion: '2026-05-27.dahlia' as any,', // Using a stable version
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export const createCheckoutSession = async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { plan } = req.body; // 'monthly' or 'annual'

  if (!['monthly', 'annual'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  try {
    const user = db.prepare('SELECT email, stripe_customer_id FROM users WHERE id = ?').get(userId) as any;

    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId },
      });
      customerId = customer.id;
      db.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?').run(customerId, userId);
    }

    const priceId = plan === 'monthly' 
      ? process.env.STRIPE_MONTHLY_PRICE_ID
      : process.env.STRIPE_ANNUAL_PRICE_ID;

    if (!priceId) {
      return res.status(500).json({ error: 'Stripe Price ID not configured' });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/pricing`,
      metadata: { userId, plan },
    });

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;
      const plan = session.metadata?.plan;

      if (userId) {
        db.prepare(`
          UPDATE users 
          SET stripe_subscription_id = ?, subscription_status = 'active', subscription_plan = ? 
          WHERE id = ?
        `).run(subscriptionId, plan, userId);
      }
      break;
    }
    case 'customer.subscription.updated': {
      const subscription = event.data.object as any;
      const customerId = subscription.customer as string;
      const status = subscription.status;

      db.prepare(`
        UPDATE users 
        SET subscription_status = ? 
        WHERE stripe_customer_id = ?
      `).run(status, customerId);
      break;
    }
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as any;
      const customerId = subscription.customer as string;

      db.prepare(`
        UPDATE users 
        SET subscription_status = 'canceled', stripe_subscription_id = NULL, subscription_plan = NULL 
        WHERE stripe_customer_id = ?
      `).run(customerId);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const user = db.prepare(`
      SELECT subscription_status, subscription_plan, stripe_subscription_id 
      FROM users 
      WHERE id = ?
    `).get(userId) as any;

    res.json({
      status: user.subscription_status,
      plan: user.subscription_plan,
      active: user.subscription_status === 'active' || user.subscription_status === 'trialing',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createPortalSession = async (req: Request, res: Response) => {
  const userId = (req as any).userId;

  try {
    const user = db.prepare('SELECT stripe_customer_id FROM users WHERE id = ?').get(userId) as any;

    if (!user.stripe_customer_id) {
      return res.status(400).json({ error: 'No Stripe customer found for this user' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${FRONTEND_URL}/dashboard`,
    });

    res.json({ url: session.url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
