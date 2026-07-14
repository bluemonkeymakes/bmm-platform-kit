import { z } from "zod";

/**
 * Upper bounds matter as much as the lower ones: without a `max`, a submitter can
 * post a multi-megabyte "message" that gets stored in the CRM and mailed to the
 * admin. These limits are generous for real humans and hostile to scripts.
 */
export const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(100, "Last name is too long"),
  email: z
    .string()
    .email("Please enter a valid email")
    .max(254, "Email is too long"), // RFC 5321 maximum
  company: z.string().max(200, "Company name is too long").optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long (5000 characters maximum)"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
