import type { Job } from "../entities/job";
import type { User } from "../entities/user";

export type FetchAllUsersForChatSidebarResponse = Array<Pick<User, "_id" | "fullName" | "profileImage">>;

export type FetchJobDetailsResponse = Omit<Job, "updatedAt">;