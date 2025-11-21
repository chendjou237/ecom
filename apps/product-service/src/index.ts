import express, {Response, Request} from "express"
import cors from "cors"
import { clerkMiddleware, getAuth } from '@clerk/express'

const app = express()
app.use(cors(
{
   origin: ["http://localhost:3002", "http://localhost:3003"],
   credentials: true
}
))
app.use(clerkMiddleware())

app.get("/health", (req:Request, res: Response)=>{
   res.status(200).json({
   status: 'ok',
   uptime: process.uptime(),
   timeStamp: Date.now()
  })
})

app.get("/test", (req, res) => {
     const {userId} = getAuth(req)

      if(!userId){
         return res.status(401).json({
            message: "You are not logged in"
         })
      }
   res.json({
      message: "Product service authenticated"
   })
})

app.listen(
   8000, ()=>{
      console.log("Server is running on port 8000");
   }
)
