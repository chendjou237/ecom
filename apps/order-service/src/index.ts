import Fastify from 'fastify'
import { uptime } from 'os';
import { clerkPlugin, getAuth } from '@clerk/fastify'


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

fastify.get('/test', async(req, reply)=>{
       const {userId} = getAuth(req)

      if(!userId){
         return reply.status(401).send({
            message: "You are not logged in"
         })
      }
       reply.send({
      message: "Order service authenticated"
   })
})
const start = async () => {
   try{

      await fastify.listen({ port: 8001});
      console.log("Order Service is running on port 8001");
   }
   catch (err){
      fastify.log.error(err)
      process.exit(1)
   }
}
start()
