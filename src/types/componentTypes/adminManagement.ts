import type { User } from "../entities/user";

export type AdminFormValues = Pick<User, "fullName" | "email"> & {
    password: string;
    role: 'subadmin' | 'superAdmin';

}