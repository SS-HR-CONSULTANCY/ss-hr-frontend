import z from "zod";
import {
  booleanField,
  enumField,
  numberField,
  stringArrayField,
  stringField,
} from "./zodUtilities";
import {
  adminRoleValues,
  applicationStatusValues,
  genderValues,
  jobValues,
  limitedroleValues,
  paymentMethodValues,
  paymentStatusValues,
  roleValues,
  workModeValues,
} from "../constants";
import {
  REGEX_PROFESSIONAL_STATUS,
  REGEX_PLACE,
  REGEX_COUNTRY,
  REGEX_FEATURE,
  REGEX_FULL_NAME,
  REGEX_LONG_TEXT,
  REGEX_NATIONALITY,
  REGEX_PASSWORD,
  REGEX_PHONE,
  REGEX_POSTAL,
  REGEX_S3_FILEKEY,
  REGEX_TEXT_DOT_AMP,
  REGEX_URL,
  REGEX_USERNAME,
  REGEX_CLIENT_NAME,
  REGEX_TESTIMONIAL,
  REGEX_ENTITY_ID,
  REGEX_DESCRIPTION,
  REGEX_INDUSTRY,
  REGEX_BENEFITS,
  REGEX_SKILLS,
  REGEX_EXPERIENCE,
  REGEX_COMPANY_NAME,
  REGEX_ADDRESSLINE,
  REGEX_LANDMARK,
} from "./regex";

//*** Zod Schema Fields & Reusable Validators */
export const gender = enumField("gender", genderValues);
export type GenderType = z.infer<typeof gender>;

export const role = enumField("role", roleValues);
export type RoleType = z.infer<typeof role>;

export const limitedRole = enumField("role", limitedroleValues);
export type LimitedRoleType = z.infer<typeof limitedRole>;

export const adminRoles = enumField("role", adminRoleValues);
export type AdminRoleTypes = z.infer<typeof adminRoles>;

export const jobType = enumField("jobType", jobValues);
export type JobtypeType = z.infer<typeof jobType>;

export const workMode = enumField("workMode", workModeValues);
export type WorkModeType = z.infer<typeof workMode>;

export const paymentMethod = enumField("paymentMethod", paymentMethodValues);
export type PaymentMethodType = z.infer<typeof paymentMethod>;

export const paymentStatus = enumField("paymentStatus", paymentStatusValues);
export type PaymentStatusType = z.infer<typeof paymentStatus>;

export const applicationStatusSchema = enumField(
  "application status",
  applicationStatusValues,
);
export type ApplicationStatusType = z.infer<typeof applicationStatusSchema>;

//** These are required schemas ( optional string field is in common zod file ) */
export const fullName = stringField("fullname", 4, 30, REGEX_FULL_NAME);
export const password = stringField("password", 8, 50, REGEX_PASSWORD);
export const confirmPassword = stringField(
  "confirmPassword",
  8,
  50,
  REGEX_PASSWORD,
);
export const otp = z.string().length(6, "OTP must be exactly 6 digits");
export const verificationToken = z.string();
export const email = z.string().email("Invalid email format");
export const phone = stringField("phone", 7, 20, REGEX_PHONE);
export const phoneTwo = stringField("phoneTwo", 7, 20, REGEX_PHONE);
export const nationality = stringField("nationality", 2, 60, REGEX_NATIONALITY);
export const linkedInUsername = stringField(
  "linkedInUsername",
  5,
  40,
  REGEX_USERNAME,
);
export const portfolioUrl = stringField("portfolioUrl", 9, 200, REGEX_URL);
export const professionalStatus = stringField(
  "professionalStatus",
  2,
  100,
  REGEX_PROFESSIONAL_STATUS,
  "Professional status can only contain letters, numbers, spaces, dots, hyphens, and ampersands",
);

export const addressLine1 = stringField(
  "addressLine1",
  3,
  100,
  REGEX_ADDRESSLINE,
);
export const addressLine2 = stringField(
  "addressLine2",
  1,
  100,
  REGEX_ADDRESSLINE,
);
export const city = stringField("city", 2, 50, REGEX_PLACE);
export const state = stringField("state", 2, 50, REGEX_PLACE);
export const district = stringField("district", 2, 50, REGEX_PLACE);
export const country = stringField("country", 2, 60, REGEX_COUNTRY);
export const postalCode = stringField("postalCode", 3, 10, REGEX_POSTAL);
export const landmark = stringField("landmark", 4, 100, REGEX_LANDMARK);
export const primary = booleanField("primary");

export const currentSalary = numberField("currentSalary", 0, 100000000);
export const expectedSalary = numberField("expectedSalary", 0, 100000000);
export const immediateJoiner = booleanField("immediateJoiner");
export const experience = stringField("experience", 1, 100, REGEX_EXPERIENCE);
export const currentDesignation = stringField(
  "currentDesignation",
  2,
  100,
  REGEX_TEXT_DOT_AMP,
);
export const currentCompany = stringField(
  "currentCompany",
  2,
  100,
  REGEX_COMPANY_NAME,
);
export const currentJobType = jobType;

export const noticePeriod = z.coerce
  .number()
  .or(z.nan())
  .refine((val) => val == null || val >= 0, "Notice period must be positive");

export const companyName = stringField(
  "companyName",
  2,
  100,
  REGEX_TEXT_DOT_AMP,
);
export const designation = stringField(
  "designation",
  2,
  100,
  REGEX_TEXT_DOT_AMP,
);
export const industry = stringField("industry", 2, 100, REGEX_INDUSTRY);
export const jobDescription = stringField(
  "jobDescription",
  10,
  5000,
  REGEX_LONG_TEXT,
);
export const benifits = stringField("benefits", 2, 1000, REGEX_BENEFITS);
export const salary = numberField("salary", 1, 1000000000);
export const skills = stringField("skills", 2, 500, REGEX_SKILLS);
export const vacancy = numberField("vacancy", 1, 100000);

export const packageName = stringField(
  "packageName",
  2,
  100,
  REGEX_TEXT_DOT_AMP,
);
export const description = stringField(
  "description",
  10,
  1000,
  REGEX_DESCRIPTION,
);
export const priceIN = numberField("priceIN", 1, 100000000);
export const priceUAE = numberField("priceUAE", 1, 100000000);
export const packageType = enumField("packageType", [
  "jobpackage",
  "tourpackage",
]);
export const packageDuration = numberField("packageDuration", 1, 365);
export const features = stringArrayField(
  "features",
  1,
  10,
  1,
  200,
  REGEX_FEATURE,
);

export const food = booleanField("food");
export const accommodation = booleanField("accommodation");
export const travelCard = booleanField("travelCard");
export const utilityBills = booleanField("utilityBills");
export const airportPickup = booleanField("airportPickup");
export const jobGuidance = booleanField("jobGuidance");

export const customerSerialNumber = stringField(
  "customerId",
  1,
  100,
  REGEX_ENTITY_ID,
);
export const totalAmount = numberField("totalAmount", 0, 100000000);
export const paidAmount = numberField("paidAmount", 0, 100000000);
export const balanceAmount = numberField("balanceAmount", 0, 100000000);

export const paymentDate = stringField("paymentDate", 1, 40, /^.{1,40}$/);
export const adminNotes = stringField("adminNotes", 0, 500, /^.{0,500}$/s);

export const s3FileKey = stringField("s3FileKey", 6, 500, REGEX_S3_FILEKEY);

export const status = booleanField("status");
export const isVisible = booleanField("isVisible");

export const clientName = stringField(
  "clientName",
  2,
  100,
  REGEX_CLIENT_NAME,
  "Client name must contain only letters and spaces, 2–100 characters",
);
export const testimonial = stringField(
  "testimonial",
  20,
  1000,
  REGEX_TESTIMONIAL,
  "Testimonial must be between 20 and 1000 characters",
);
