import * as Yup from "yup";

export const ProfileValidationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .min(3, "First name must be at least 3 characters")
    .max(20, "First name must be at most 20 characters"),
  lastName: Yup.string()
    .required("Last name is required")
    .min(3, "Last name must be at least 3 characters")
    .max(20, "Last name must be at most 20 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email"),
});
