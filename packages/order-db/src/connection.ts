import mongoose from "mongoose"

let isConnected = false;

export const connectOrderDb = async () => {
   if (isConnected) return;
   if (!process.env.MONGO_URL) {
        throw new Error("MONGO_URL must be defined")
    }

    try {
        await mongoose.connect(process.env.MONGO_URL! );
        isConnected = true;
        console.log("Order DB connected")
    } catch (error) {
        console.log(error)
throw error    }
}
