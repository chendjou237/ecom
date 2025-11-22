import { FastifyInstance } from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware.js";
import {Order} from "@repo/order-db"
export const orderRoute = (fastify: FastifyInstance)=>{
    fastify.get('/user-orders',{preHandler:shouldBeUser}, async (request, reply)=>{
      const order = await Order.find({userId:request.userId});
      reply.send(order)
    })
    fastify.get('/orders',{preHandler:shouldBeAdmin}, async (request, reply)=>{
      const order = await Order.find();
      reply.send(order)
    })
}
