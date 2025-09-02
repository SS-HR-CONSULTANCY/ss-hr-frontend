import type { User } from "../entities/user";

export type FetchAllUsersForChatSidebarResponse = Array<Pick<User, "_id" | "fullName" | "profileImage">>;
