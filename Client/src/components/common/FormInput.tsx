import type { FunctionComponent } from "react";
import { useField } from "formik";
import "./FormInput.css";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  as?: "input" | "textarea" | "checkbox";
  rows?: number;
}

const FormInput: FunctionComponent<FormInputProps> = ({
  name,
  label,
  type = "text",
  as = "input",
  rows = 5,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <div className="form-floating mb-3">
      {as === "textarea" ? (
        <div className="inputbox">
          <textarea
            {...field}
            id={name}
            className={`${meta.touched && meta.error ? "is-invalid" : ""}`}
            rows={rows}
            placeholder=""
            style={{ maxHeight: "120px" }}
          />
          <span>{label}</span>
          <i></i>
        </div>
      ) : as === "checkbox" ? (
        <label className="check-container">
          <input
            {...field}
            type="checkbox"
            id={name}
            checked={field.value}
            onChange={(e) => {
              helpers.setValue(e.target.checked);
            }}
            className={`${meta.touched && meta.error ? "is-invalid" : ""}`}
          />
          <div className="checkmark"></div>
          <label htmlFor={name} className="bounce-text">
            {label}
          </label>
        </label>
      ) : (
        <div className="inputbox">
          <input {...field} type={type} id={name} placeholder="" />
          <span>{label}</span>
          <i
            className={`${meta.touched && meta.error ? "is-invalid" : ""}`}></i>
        </div>
      )}
      {as !== "checkbox" && <label htmlFor={name}></label>}
      {meta.touched && meta.error && (
        <div className="invalid-feedback">{meta.error}</div>
      )}
    </div>
  );
};

export default FormInput;
