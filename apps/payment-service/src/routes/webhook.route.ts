import { Hono } from "hono";
import { Stripe } from "stripe";
import stripe from "../utils/stripe.js";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY as string;
const webhookRoute = new Hono()

webhookRoute.post('/stripe', async (c) => {
   const body = await c.req.text();
   const sig = c.req.header('stripe-signature');
      let event: Stripe.Event;

      try {
         event = stripe.webhooks.constructEvent(
            body,
            sig!,
            webhookSecret
         );
      } catch (_) {
         console.log("webhook verification failed!");
         return c.json({ error: "Webhook verification failed" }, 400);
      }

      switch (event.type) {
         case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;
            const lineItems = await stripe.checkout.sessions.listLineItems(session.id);


            break;
         default:
            console.log(`Unhandled event type: ${event.type}`);



   }

   return c.json({ received: true });

}

)

export default webhookRoute;
