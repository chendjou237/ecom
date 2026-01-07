import { consumer } from "./kafka.js";
import { createOrder } from "./order.js";

export const runKafkaSubscriptions = async ()=> {
   try {
      // Subscribe to all topics first
      await consumer.subscribe("payment.successful", async(message)=> {
         try {
            console.log("Received message: payment.successful", message.value);
            const order = message.value;
            await createOrder(order);
         } catch (error) {
            console.error("Error processing payment.successful:", error);
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
