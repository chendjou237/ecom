import { consumer } from "./kafka.js";
import { createStripeProduct, deleteStripeProduct } from "./stripeProduct.js";

export const runKafkaSubscriptions = async ()=> {
   try {
      // Subscribe to all topics first
      await consumer.subscribe("product.created", async(message)=> {
         try {
            const product = message.value
            console.log("Received message: product.created", product);
            await createStripeProduct(product);
            console.log("Successfully created Stripe product:", product.id);
         } catch (error) {
            console.error("Error creating Stripe product:", error);
            // Don't rethrow - let the consumer continue processing other messages
         }
      })

      await consumer.subscribe("product.deleted", async(message)=> {
         try {
            const id = message.value
            console.log("Received message: product.deleted", id);
            await deleteStripeProduct(id);
            console.log("Successfully deleted Stripe product:", id);
         } catch (error) {
            console.error("Error deleting Stripe product:", error);
            // Don't rethrow - let the consumer continue processing other messages
         }
      })

      // Start the consumer once after all subscriptions are set up
      await consumer.start();
      console.log("Kafka consumer started successfully");
   } catch (error) {
      console.error("Error setting up Kafka subscriptions:", error);
      throw error;
   }
}
