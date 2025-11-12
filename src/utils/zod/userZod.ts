import z from "zod";
import { optionalStringField } from "./zodUtilities";
import { REGEX_COMPANY_NAME, REGEX_INDUSTRY, REGEX_TEXT_DOT_AMP, REGEX_URL, REGEX_USERNAME } from "./regex";
import { currentSalary, email, expectedSalary, experience, fullName, gender, immediateJoiner, jobType, nationality, noticePeriod, phone, phoneTwo, professionalStatus, workMode } from "./commonZod";

// User profile data updating zod schema
export const userProfileDataSchema = z.object({
  fullName,
  email,
  phone,
  phoneTwo,
  gender,
  nationality,
  linkedInUsername: optionalStringField("LinkedIn username", 5, 40, REGEX_USERNAME, "Enter a valid LinkedIn username (letters, numbers, or hyphens only)."),
  portfolioUrl: optionalStringField("Portfolio URL", 9, 200, REGEX_URL, "Enter a valid portfolio URL (must start with http:// or https://)."),
  dob: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format.",
    })
    .refine((val) => {
      const dob = new Date(val);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const hasNotHadBirthdayThisYear =
        today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate());

      if (hasNotHadBirthdayThisYear) age--;

      return age >= 18;
    }, {
      message: "You must be at least 18 years old",
    })
    .refine((val) => new Date(val) <= new Date(), {
      message: "DOB cannot be in the future",
    }),
  professionalStatus,
})
export type ProfileDataForm = z.infer<typeof userProfileDataSchema>;

// User resume handling zod schema
export const resumeZodSchema = z.object({
  resume: z
    .instanceof(File)
    .refine((file) => !!file, "Please upload a file")
    .refine(
      (file) => /\.(pdf|doc|docx)$/i.test(file?.name ?? ""),
      "Only PDF, DOC, or DOCX files are allowed"
    )
    .refine(
      (file) => (file?.size ?? 0) <= 5 * 1024 * 1024,
      "File size must be less than 1 MB"
    ),
});
export type ResumeDataForm = z.infer<typeof resumeZodSchema>;

// User profile image handling zod schema
export const profileImageZodSchema = z.object({
  profileImage: z
    .instanceof(File)
    .refine((file) => !!file, "Please upload a profile image")
    .refine(
      (file) => /\.(png|jpg|jpeg)$/i.test(file?.name ?? ""),
      "Only PNG, JPG, or JPEG files are allowed"
    )
    .refine(
      (file) => (file?.size ?? 0) <= 5 * 1024 * 1024,
      "File size must be less than 1 MB"
    ),
});
export type ProfileImageForm = z.infer<typeof profileImageZodSchema>;

// User Career Data zod schema
export const careerDataSchema = z.object({
  currentSalary,
  expectedSalary,
  immediateJoiner,
  noticePeriod,
  experience,
  currentDesignation: optionalStringField(
    "currentDesignation",
    2,
    100,
    REGEX_TEXT_DOT_AMP,
    "Enter a valid designation (letters, dots, or ampersands allowed)."
  ),
  currentCompany: optionalStringField(
    "currentCompany",
    2,
    100,
    REGEX_COMPANY_NAME,
    "Enter a valid company name."
  ),
  industry: optionalStringField(
    "industry",
    2,
    100,
    REGEX_INDUSTRY,
    "Enter a valid industry name."
  ),
  currentJobType: jobType,
  preferredJobTypes: z.array(jobType).optional(),
  preferredWorkModes: z.array(workMode).optional(),
})
  .superRefine((data, ctx) => {
    if (!data.immediateJoiner && (data.noticePeriod === undefined || data.noticePeriod === null)) {
      ctx.addIssue({
        code: "custom",
        path: ["noticePeriod"],
        message: "Notice period is required if you are not an immediate joiner",
      });
    }
  });
export type CareerDataForm = z.infer<typeof careerDataSchema>;


