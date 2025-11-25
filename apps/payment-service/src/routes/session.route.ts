import { CartItemsType } from "@repo/types";
import { Hono } from "hono";
import stripe from "../utils/stripe.js";
import { getStripeProductPrice } from "../utils/stripeProduct.js";
import { shouldBeUser } from "../middleware/authMiddleware.js";
const sessionRoute = new Hono()

sessionRoute.post('/create-checkout-session',shouldBeUser, async (c)=>{
   const {cart}:{cart:CartItemsType} = await c.req.json();
   const userId = c.get("userId") as string;
   
   const lineItems = await Promise.all(
      cart.map(async (item)=> {
         const unitAmount = await getStripeProductPrice(item.id);
         return {
              price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: unitAmount as number,
                },
                quantity: item.quantity,


      }})
   )
   try {


    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        client_reference_id: userId,
        mode: 'payment',
        ui_mode: "custom",
        return_url: 'http://localhost:3001/return?session_id={CHECKOUT_SESSION_ID}',
    });
console.log(session);

    return c.json({
        checkoutSessionClientSecret: session.client_secret,
    })
   }catch (error) {
      console.log(error);
      return c.json({
        error: error
      }, 500)

   }
   })

   sessionRoute.get('/:session_id', async (c)=>{
      const session = await stripe.checkout.sessions.retrieve(c.req.param('session_id'), {
         expand: ['line_items']
      });

      console.log(session);

      return c.json({
         status: session.status,
         paymentStatus: session.payment_status
      });

   })

   export default sessionRoute;
