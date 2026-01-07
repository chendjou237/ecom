import { consumer } from "./kafka.js"
import { createStripeProduct, deleteStripeProduct } from "./stripeProduct.js";

export const runKafkaSubscriptions = async ()=> {
   consumer.subscribe("product.created", async(message)=> {
      const product = message.value
      console.log("receive message: product.created", product);
      await createStripeProduct(product);
   })

      consumer.subscribe("product.deleted", async(message)=> {
      const id = message.value
      console.log("receive message: product.deleted", id);

      await deleteStripeProduct(id);

   })
}
