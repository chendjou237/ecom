import {Router} from "express"
import clerkClient from "../utils/clerk.js"

const router:Router = Router()

router.get("/", async(req, res)=>{
   const users = await clerkClient.users.getUserList();
   res.status(200).json(users);
})

router.get("/:id", async(req, res)=>{
   const user = await clerkClient.users.getUser(req.params.id);
   res.status(200).json(user);
})

router.post("/", async(req, res)=>{
   type CreateParams = Parameters<typeof clerkClient.users.createUser>[0];
   const newUser:CreateParams = req.body;
   const user = await clerkClient.users.createUser(newUser);
   res.status(200).json(user);
})

router.delete("/:id", async(req, res)=>{
   const user = await clerkClient.users.deleteUser(req.params.id);
   res.status(200).json(user);
})


export default router
