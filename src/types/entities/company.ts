export interface Company {
    _id: string;
    companyName: string;
    companyLogo: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    availableJobCount: number;
    availablePostsWithCount: {
        post: string, count: number
    }[]
}