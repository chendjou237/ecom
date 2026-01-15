import z from "zod";

export interface CustomJwtSessionClaims{
   metadata?: {
      role?: "user" | "admin";
   }
}

 export const UserFormSchema = z.object({
  firstName: z
    .string({ message: "First Name is required!" })
    .min(2, { message: "First Name must be at least 2 characters!" })
    .max(50),
  lastName: z
    .string({ message: "Last Name is required!" })
    .min(2, { message: "Last Name must be at least 2 characters!" })
    .max(50),
  username: z
    .string({ message: "User Name is required!" })
    .min(2, { message: "User Name must be at least 2 characters!" })
    .max(50),
  emailAddress: z.array(z.string({ message: "Email Address is required!" }).email({ message: "Invalid email address!" })),
  password: z.string({ message: "Password is required!" }).min(8, { message: "Password must be at least 8 characters!" }),

});
