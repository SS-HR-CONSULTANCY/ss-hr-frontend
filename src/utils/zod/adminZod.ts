import z from "zod";
import { email, fullName, password, phone, phoneTwo } from "./commonZod";

// admin create new user
export const adminCreateNewUser = z.object({
    fullName,
    email,
    password,
    phone,
    phoneTwo
});
export type AdminCrateUserForm = z.infer<typeof adminCreateNewUser>;
