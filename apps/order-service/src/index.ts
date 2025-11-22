import Fastify from 'fastify'
import { uptime } from 'os';
import { clerkPlugin, getAuth } from '@clerk/fastify'
import { shouldBeUser } from './middleware/authMiddleware.js';
import { connectOrderDb } from '@repo/order-db';
import { orderRoute } from './routes/order.router.js';


const fastify = Fastify({
   logger: true
})
fastify.register(clerkPlugin)

fastify.get('/health', async (request, reply) => {
   reply.status(200).send({
   status: 'ok',
   uptime: process.uptime(),
   timeStamp: Date.now()
  });
})

fastify.get('/test',{preHandler: shouldBeUser}, async(req, reply)=>{

       reply.send({
      message: "Order service authenticated",
      userId: req.userId
   })
})

fastify.register(orderRoute)

const start = async () => {
   try{
      await connectOrderDb();
      await fastify.listen({ port: 8001});
      console.log("Order Service is running on port 8001");
   }
   catch (err){ 
      fastify.log.error(err)
      process.exit(1)
   }
}
start()
