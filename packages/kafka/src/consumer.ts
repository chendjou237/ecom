import { Kafka } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupId:string) => {
   const consumer = kafka.consumer({ groupId })
   const topicHandlers = new Map<string, (message: any) => Promise<void>>();
   let isRunning = false;

   const connect = async () => {
      await consumer.connect()
      console.log("kafka consumer connected: " + groupId);
   }

   const subscribe = async (topic:string, handler: (message:any)=> Promise<void>) => {
      // Store the handler for this topic
      topicHandlers.set(topic, handler);

      // Subscribe to the topic
      await consumer.subscribe({ topic, fromBeginning: true });
   }

   const start = async () => {
      if (isRunning) {
         console.warn("Consumer is already running");
         return;
      }

      isRunning = true;

      await consumer.run({
         eachMessage: async ({ topic, partition, message }) => {
            try {
               const value = message.value?.toString()
               if (value) {
                  const handler = topicHandlers.get(topic);
                  if (handler) {
                     await handler(JSON.parse(value));
                  } else {
                     console.warn(`No handler found for topic: ${topic}`);
                  }
               }
            } catch (error) {
               console.error('Error processing message from topic', topic, ':', error);
               // Don't rethrow - let the consumer continue processing other messages
            }
         },
      });
   }

   const disconnect = async () => {
      await consumer.disconnect()
      isRunning = false;
   }

   return {
      connect,
      subscribe,
      start,
      disconnect
   }
}
