import { getAuth } from "@clerk/express"
import { NextFunction, Request, Response } from "express"
import { CustomJwtSessionClaims } from "@repo/types"
declare global {
   namespace Express {
      interface Request {
         userId?: string
      }
   }
}

export const shouldBeUser = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req)
  if (!auth.userId) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  req.userId = auth.userId;
  const token =  auth.getToken()
  console.log("User token: ",token)
  next()
}
export const shouldBeAdmin = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req)
  if (!auth.userId) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

      const claims = auth.sessionClaims as CustomJwtSessionClaims;

    if(claims.metadata?.role !== "admin"){
         return res.status(403).send({
            message: "You are not an admin"
         })
      }

  req.userId = auth.userId;
  const token =  auth.getToken()
  console.log("Admin token: ",token)
  next()
}
