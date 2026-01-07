import { StripeProductType } from "@repo/types";
import stripe from "./stripe.js";

export const createStripeProduct = async (item: StripeProductType) =>{
   try {
      const res = await stripe.products.create({
         id: item.id,
         name: item.name,
         default_price_data: {
            currency: 'usd',
            unit_amount: item.price * 100,
         },
      });
      console.log("Stripe product created successfully:", res.id);
      return res;
   } catch (error) {
      console.error("Failed to create Stripe product:", {
         productId: item.id,
         productName: item.name,
         error: error instanceof Error ? error.message : error
      });
      throw error; // Throw instead of returning to properly signal failure
   }
}

export const getStripeProductPrice = async (productId: number) =>{
   try {
      const res = await stripe.prices.list({
         product: productId.toString(),
      });
      return res.data[0]?.unit_amount;
   } catch (error) {
      console.error("Failed to get Stripe product price:", {
         productId,
         error: error instanceof Error ? error.message : error
      });
      throw error;
   }
}

export const deleteStripeProduct = async (id: number) =>{
   try {
      const res = await stripe.products.del(id.toString());
      if (res.deleted) {
         console.log('Stripe product deleted successfully:', id);
         return res;
      }
      else{
         throw new Error("Failed to delete product from Stripe")
      }
   } catch (error) {
      console.error("Failed to delete Stripe product:", {
         productId: id,
         error: error instanceof Error ? error.message : error
      });
      throw error;
   }
}
