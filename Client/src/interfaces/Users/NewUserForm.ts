import * as yup from "yup";
import { errorMessage, successMessage } from "../../services/feedback.service";
import { registerUser } from "../../services/user.service";
import { normalizedUser } from "../../utilities/users/NormalizeUser";
import type { FormikHelpers } from "formik";
import type { ApiError } from "../ApiError";

export const initialValues = {
  first: "",
  last: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  dateOfBirth: "",
  image_url: "",
};

const minAge = 13;

export const validationSchema = yup.object({
  first: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(256, "First name must be at most 256 characters")
    .required("First name is required"),

  last: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(256, "Last name must be at most 256 characters")
    .required("Last name is required"),

  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  email: yup
    .string()
    .email("Must be a valid email")
    .min(5, "Email must be at least 5 characters")
    .required("Email is required"),

  dateOfBirth: yup
    .date()
    .required("Date of birth is required")
    .typeError("Date of birth must be a valid date")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - minAge)),
      `You must be at least ${minAge} years old`
    ),

  password: yup
    .string()
    .required("Password is required")
    .min(7, "Password must be at least 7 characters")
    .max(20, "Password must be at most 20 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-_])[A-Za-z\d!@#$%^&*\-_]{7,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-_)"
    ),

  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),

  image_url: yup
    .string()
    .url("Invalid URL")
    .nullable()
    .notRequired()
    .test(
      "min-length-if-present",
      "Profile image URL must be at least 14 characters",
      (value) => !value || value.length >= 14
    ),
});

export const onSubmit = async (
  values: typeof initialValues,
  helpers: FormikHelpers<typeof initialValues>,
  onSuccess: () => void
) => {
  try {
    await registerUser(normalizedUser(values));
    helpers.resetForm();
    successMessage("User created successfully");
    onSuccess();
  } catch (err: Error | unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const apiError = err as ApiError;
      const statusCode = apiError.response.status;
      const errorMessages: { [key: number]: string } = {
        400: "Invalid request. Please check your input.",
        409: "User already exists. Please try a different email or username.",
      };
      const message =
        errorMessages[statusCode] ||
        (statusCode >= 500
          ? "Server error. Please try again later."
          : "Error creating user. Please try again");
      errorMessage(message);
    } else {
      errorMessage("An unknown error occurred. Please try again later.");
    }
    console.error(err);
  }
};
