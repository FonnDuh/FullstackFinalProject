import * as yup from "yup";
import { errorMessage, successMessage } from "../../services/feedback.service";
import { registerUser } from "../../services/user.service";
import { normalizedUser } from "../../utilities/users/NormalizeUser";
import type { FormikHelpers } from "formik";
import type { ApiError } from "../ApiError";

export const initialValues = {
  first: "",
  last: "",
  email: "",
  username: "",
  dateOfBirth: "",
  password: "",
  confirmPassword: "",
  image_url: "",
};

const minAge = 13;
export const validationSchema = yup.object({
  first: yup.string().min(2).max(256).required("First Name is required"),
  last: yup.string().min(2).max(256).required("Last Name is required"),
  email: yup.string().email().min(5).required("Email is required"),
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  date_of_birth: yup
    .date()
    .required("Date of birth is required")
    .typeError("Date of birth must be a valid date")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - minAge)),
      `You must be at least ${minAge} years old`
    ),
  password: yup
    .string()
    .min(7)
    .max(20)
    .required("Password is required")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{7,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 7 characters long'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match"),
  image_url: yup.string().min(14).url("Invalid URL"),
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
