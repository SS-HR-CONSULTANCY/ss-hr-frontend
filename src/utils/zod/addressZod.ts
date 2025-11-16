import z from "zod";
import { addressLine1, addressLine2, city, state, district, country, postalCode, landmark, primary, } from "./commonZod";

export const createJobSchema = z.object({
    addressLine1,
    addressLine2,
    city,
    state,
    district,
    country,
    postalCode,
    landmark,
    primary,
});

export type AddressForm = z.infer<typeof createJobSchema>;