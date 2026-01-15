import express, {Response, Request, NextFunction} from "express"
import cors from "cors"
import { clerkMiddleware, getAuth } from '@clerk/express'
import { shouldBeAdmin } from "./middleware/authMiddle.js"
import userRoute from "./routes/user.route.js"

const app = express()
app.use(cors(
{
   origin: [ "http://localhost:3003", "http://localhost:3000"],
   credentials: true
}
))
app.use(express.json())
app.use(clerkMiddleware())

app.use((err:any, req:Request,res: Response, next: NextFunction)=>{
   console.log(err.stack)
   return res.status(err.status || 500).json({message: err.message || "Internal Server Error"})
})
app.get("/health", (req:Request, res: Response)=>{
   res.status(200).json({
   status: 'ok',
   uptime: process.uptime(),
   timeStamp: Date.now()
  })
})



app.use("/users",shouldBeAdmin, userRoute )
const start = async ()=>{
try {

   app.listen(
      8003, ()=>{

         console.log("Server is running on port 8003");
      })
} catch (error) {
console.log(error);
process.exit(1);
}
}

start()
