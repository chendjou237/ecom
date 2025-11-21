import { getAuth } from "@clerk/express"
import { NextFunction, Request, Response } from "express"

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
  next()
}
