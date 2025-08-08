import { type FunctionComponent } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Calendar } from "lucide-react";
import "./Register.css";
import {
  initialValues,
  validationSchema,
  onSubmit as formOnSubmit,
} from "../interfaces/Users/NewUserForm";

const Register: FunctionComponent<object> = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>
  ) => {
    await formOnSubmit(values, helpers, () => {
      navigate("/");
    });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">Register</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="register-form">
              {/* First Name */}
              <div className="input-group">
                <User className="input-icon" />
                <Field
                  as="input"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="register-input"
                />
              </div>
              <ErrorMessage
                name="firstName"
                component="div"
                className="error"
              />

              {/* Last Name */}
              <div className="input-group">
                <User className="input-icon" />
                <Field
                  as="input"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="register-input"
                />
              </div>
              <ErrorMessage name="lastName" component="div" className="error" />

              {/* Username */}
              <div className="input-group">
                <User className="input-icon" />
                <Field
                  as="input"
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="register-input"
                />
              </div>
              <ErrorMessage name="username" component="div" className="error" />

              {/* Email */}
              <div className="input-group">
                <Mail className="input-icon" />
                <Field
                  as="input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="register-input"
                />
              </div>
              <ErrorMessage name="email" component="div" className="error" />

              {/* Password */}
              <div className="input-group">
                <Lock className="input-icon" />
                <Field
                  as="input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="register-input"
                />
              </div>
              <ErrorMessage name="password" component="div" className="error" />

              {/* Confirm Password */}
              <div className="input-group">
                <Lock className="input-icon" />
                <Field
                  as="input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="register-input"
                />
              </div>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error"
              />

              {/* Date of Birth */}
              <div className="input-group">
                <Calendar className="input-icon" />
                <Field
                  as="input"
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  className="register-input"
                />
              </div>
              <ErrorMessage
                name="dateOfBirth"
                component="div"
                className="error"
              />

              {/* Profile Image URL */}
              <div className="input-group">
                <User className="input-icon" />
                <Field
                  as="input"
                  type="url"
                  name="profileImageUrl"
                  placeholder="Profile Image URL"
                  className="register-input"
                />
              </div>
              <ErrorMessage
                name="profileImageUrl"
                component="div"
                className="error"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="register-button">
                {isSubmitting ? "Registering..." : "Register"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
