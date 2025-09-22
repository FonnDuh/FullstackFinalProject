import { type FunctionComponent } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Calendar } from "lucide-react";
import * as Button from "@radix-ui/react-slot";
import "./Forms.css";
import {
  initialValues,
  validationSchema,
  onSubmit as formOnSubmit,
} from "../../interfaces/Users/NewUserForm";

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
    <div className="form-container">
      <div className="form-card">
        <h1 className="form-title">Register</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="form-body">
              <div className="input-group">
                <User className="input-icon" />
                <Field
                  as="input"
                  type="text"
                  name="first"
                  placeholder="First Name"
                  className="form-input"
                />
              </div>
              <ErrorMessage name="first" component="div" className="error" />
              <div className="input-group">
                <User className="input-icon" />
                <Field
                  as="input"
                  type="text"
                  name="last"
                  placeholder="Last Name"
                  className="form-input"
                />
              </div>
              <ErrorMessage name="last" component="div" className="error" />
              <div className="input-group">
                <User className="input-icon" />
                <Field
                  as="input"
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="form-input"
                />
              </div>
              <ErrorMessage name="username" component="div" className="error" />
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
                <Lock className="input-icon" />
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="form-input"
                  placeholder="Password"
                />
              </div>
              <ErrorMessage name="password" component="div" className="error" />
              <div className="input-group">
                <Lock className="input-icon" />
                <Field
                  as="input"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="form-input"
                />
              </div>
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="error"
              />
              <div className="input-group">
                <Calendar className="input-icon" />
                <Field
                  as="input"
                  type="date"
                  name="dateOfBirth"
                  placeholder="Date of Birth"
                  className="form-input"
                />
              </div>
              <ErrorMessage
                name="dateOfBirth"
                component="div"
                className="error"
              />
              <div className="input-group">
                <User className="input-icon" />
                <Field
                  as="input"
                  type="url"
                  name="image_url"
                  placeholder="Profile Image URL"
                  className="form-input"
                />
              </div>
              <ErrorMessage
                name="image_url"
                component="div"
                className="error"
              />
              <Button.Slot>
                <button
                  type="submit"
                  className="form-button"
                  disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </Button.Slot>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
