import type { User } from "../authSliceTypes";

export type AdminfetchAllUsersResponse = Pick<User, "_id" | "email" | "isActive" | "isVerified" | "profileImg" | "fullName" | "createdAt">;;
