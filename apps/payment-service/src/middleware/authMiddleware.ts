import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
export const shouldBeUser = createMiddleware(async (c, next) => {
     const auth = getAuth(c)
   if(!auth?.userId) {
    return c.json({
      status: 'error',
      message: 'You are not logged In'
    }, 401)
   }
await next()
})
