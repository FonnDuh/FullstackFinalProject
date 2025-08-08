import { type FunctionComponent, useCallback, useMemo } from "react";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { Mail, Lock } from "lucide-react";
import * as Label from "@radix-ui/react-label";
import * as Separator from "@radix-ui/react-separator";
import * as Button from "@radix-ui/react-slot";
import { useNavigate } from "react-router-dom";
import "./Login.css";
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
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>
        <Separator.Root className="login-separator" />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-field">
                <Label.Root htmlFor="email" className="form-label">
                  Email
                </Label.Root>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="form-error"
                />
              </div>
              <div className="form-field">
                <Label.Root htmlFor="password" className="form-label">
                  Password
                </Label.Root>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="form-input"
                    placeholder="Enter your password"
                  />
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="form-error"
                />
              </div>
              <Button.Slot>
                <button
                  type="submit"
                  className="form-submit-btn"
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
