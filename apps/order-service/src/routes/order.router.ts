import { Order } from "@repo/order-db";
import { startOfMonth, subMonths } from "date-fns";
import { FastifyInstance } from "fastify";
import { shouldBeAdmin, shouldBeUser } from "../middleware/authMiddleware.js";
import { OrderChartType } from "@repo/types";
export const orderRoute = (fastify: FastifyInstance)=>{
    fastify.get('/user-orders',{preHandler:shouldBeUser}, async (request, reply)=>{
      const order = await Order.find({userId:request.userId});
      reply.send(order)
    })
    fastify.get('/orders',{preHandler:shouldBeAdmin}, async ({query}, reply)=>{
      const {limit} = query as {limit?: number};
      const order = await Order.find().limit(limit || 10 ).sort({createdAt:-1});
      reply.send(order)
    })
    fastify.get('/order-chart',{preHandler:shouldBeAdmin}, async (request, reply)=>{
      const now = new Date()
      const sixMonthsAgo = startOfMonth(subMonths(now, 5));

      const raw = await Order.aggregate([
         {
            $match:{createdAt:{
               $gte:sixMonthsAgo, $lte:now
            }}
         },
         {
            $group:{
               _id:{
                  year:{$year:"$createdAt"},
                  month:{$month:"$createdAt"},
               },
               total:{
                  $sum: 1
               },
               successful: {
                  $sum:{
                     $cond: [{$eq: ["$status", "success"]}, 1, 0],
                  }
               }
            }
         },
         {
            $project:{
               _id:0,
               month: "$_id.month",
               year: "$_id.year",
               total:1,
               successful:1
            }
         },
         {
            $sort:{
               year:1,
               month:1
            },
         },
      ]);

      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      const results: OrderChartType[] = [];
      for (let i =5; i>=0; i--){
         const d = subMonths(now, i);
         const year = d.getFullYear();
         const month = d.getMonth() + 1;

         const match = raw.find((r)=> r.year === year && r.month === month);
         results.push({
            month: monthNames[month-1] as string,
            total: match ? match.total : 0,
            successful: match ? match.successful : 0
         })
      }
    return  reply.send(results);
    })
}
