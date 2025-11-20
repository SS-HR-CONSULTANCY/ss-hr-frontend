import { z } from "zod";

// career Data zod schema
export const jobTypeEnum = z.enum([
  "full-time",
  "part-time",
  "contract",
  "internship",
  "freelance",
]);
export const workModeEnum = z.enum(["onsite", "remote", "hybrid"]);

export const careerDataSchema = z
  .object({
    currentSalary: z.coerce
      .number()
      .min(0, "Current salary must be greater than or equal to 0")
      .max(100000000, "Current salary seems too high")
      .optional(),

    expectedSalary: z.coerce
      .number()
      .min(0, "Expected salary must be greater than or equal to 0")
      .max(100000000, "Expected salary seems too high")
      .optional(),

    immediateJoiner: z.coerce.boolean(),
    noticePeriod: z.coerce
      .number()
      .optional()
      .or(z.nan()) // allow empty if hidden
      .refine(
        (val) => val == null || val >= 0,
        "Notice period must be positive",
      ),

    experience: z.string().optional(),

    currentDesignation: z
      .string()
      .trim()
      .min(2, "Designation must be at least 2 characters")
      .max(100, "Designation too long")
      .optional(),

    currentCompany: z
      .string()
      .trim()
      .min(2, "Company name must be at least 2 characters")
      .max(100, "Company name too long")
      .optional(),

    industry: z
      .string()
      .trim()
      .min(2, "Industry name must be at least 2 characters")
      .max(100, "Industry name too long")
      .optional(),

    currentJobType: jobTypeEnum.optional(),
    preferredJobTypes: z.array(jobTypeEnum).optional(),
    preferredWorkModes: z.array(workModeEnum).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !data.immediateJoiner &&
      (data.noticePeriod === undefined || data.noticePeriod === null)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["noticePeriod"],
        message: "Notice period is required if you are not an immediate joiner",
      });
    }
  });
export type CareerData = z.infer<typeof careerDataSchema>;
