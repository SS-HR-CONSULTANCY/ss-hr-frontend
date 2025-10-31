export interface Address {
    _id: string;
    userId: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    district?: string;
    country: string;
    postalCode?: string;
    poBox?: string;
    landmark?: string;
    updatedAt: string;
    createdAt: string;
}