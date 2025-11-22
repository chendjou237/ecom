import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import { CustomJwtSessionClaims } from "@repo/types";
declare module "fastify"{
   interface FastifyRequest{
      userId?: string
   }
}
export const  shouldBeUser= async (request: FastifyRequest, reply:FastifyReply) =>{
     const {userId} =await getAuth(request)

      if(!userId){
         return reply.status(401).send({
            message: "You are not logged in"
         })
      }
request.userId = userId;

}
export const  shouldBeAdmin= async (request: FastifyRequest, reply:FastifyReply) =>{
     const {userId, sessionClaims} = getAuth(request)

      if(!userId){
         return reply.status(401).send({
            message: "You are not logged in"
         })
      }

      const claims = sessionClaims as CustomJwtSessionClaims;

      if(claims.metadata?.role !== "admin"){
         return reply.status(403).send({
            message: "You are not an admin"
         })

      }

request.userId = userId;

}
