import { type FunctionComponent, useCallback, useMemo } from "react";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { Mail, Lock } from "lucide-react";
import * as Button from "@radix-ui/react-slot";
import { useNavigate } from "react-router-dom";
import "./Forms.css";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../services/user.service";
import { errorMessage, successMessage } from "../services/feedback.service";
import type { ApiError } from "../interfaces/ApiError";

const formOnSubmit = async (
  values: { email: string; password: string },
  helpers: FormikHelpers<{ email: string; password: string }>,
  onSuccess: () => void,
  login: (token: string) => void
) => {
  try {
    const response = await loginUser(values),
      token = response.data.token;
    if (token) {
      login(token);
      helpers.resetForm();
      successMessage(
        `${values.email.trim().split("@")[0]} has logged in successfully`
      );
      onSuccess();
    } else {
      throw new Error("Token is undefined");
    }
  } catch (err: Error | unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const apiError = err as ApiError;
      if (apiError.response.status === 401) {
        errorMessage("Email or Password is incorrect");
      } else if (apiError.response.data.message == "User not found") {
        errorMessage("User not found. Please check your credentials.");
      } else if (apiError.response.status === 429) {
        errorMessage("Too many login attempts. Please try again later.");
      } else {
        errorMessage("Connection error. Please try again later.");
      }
    } else if (err instanceof Error && err.message === "Token is undefined") {
      errorMessage("Token is undefined. Please try again later.");
    } else {
      errorMessage("An error occurred during login");
    }
  }
};

const Login: FunctionComponent = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const initialValues = useMemo(
    () => ({
      email: "",
      password: "",
    }),
    []
  );

  const validationSchema = useMemo(
    () =>
      yup.object({
        email: yup.string().email().min(5).required("Email is required"),
        password: yup
          .string()
          .min(7)
          .max(20)
          .required("Password is required")
          .matches(
            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*\-"])[A-Za-z\d!@#$%^&*\-"]{7,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*-"), and be at least 7 characters long'
          ),
      }),
    []
  );

  const handleSubmit = useCallback(
    async (
      values: typeof initialValues,
      helpers: FormikHelpers<typeof initialValues>
    ) => {
      await formOnSubmit(
        values,
        helpers,
        () => {
          navigate("/");
        },
        login
      );
    },
    [navigate, login]
  );

  return (
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Login</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="form-body">
              <div className="input-group">
                <Mail className="input-icon" />
                <Field
                  as="input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-input"
                />
              </div>
              <ErrorMessage name="email" component="div" className="error" />
              <div className="input-group">
                <Lock className="input-icon" size={18} />
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Password"
                />
              </div>
              <ErrorMessage name="password" component="div" className="error" />
              <Button.Slot>
                <button
                  type="submit"
                  className="form-button"
                  disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Button.Slot>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
