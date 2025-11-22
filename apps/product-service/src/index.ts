import express, {Response, Request, NextFunction} from "express"
import cors from "cors"
import { clerkMiddleware, getAuth } from '@clerk/express'
import { shouldBeUser } from "./middleware/authMiddle.js"
import  productRouter from "./routes/product.route.js"
import  categoryRouter from "./routes/category.route.js"
const app = express()
app.use(cors(
{
   origin: ["http://localhost:3002", "http://localhost:3003"],
   credentials: true
}
))
app.use(express.json())
app.use(clerkMiddleware())

app.use((err:any, req:Request,res: Response, next: NextFunction)=>{
   console.log(err.stack)
   res.status(500).json({message: err.message || "Internal Server Error"})

})
app.get("/health", (req:Request, res: Response)=>{
   res.status(200).json({
   status: 'ok',
   uptime: process.uptime(),
   timeStamp: Date.now()
  })
})

app.get("/test",shouldBeUser,  (req, res) => {
const token  =
   res.json({
      message: "Product service authenticated",
      userId: req.userId,
   })
})

app.use("/products", productRouter)
app.use("/categories", categoryRouter)

app.listen(
   8000, ()=>{
      console.log("Server is running on port 8000");
   }
)
