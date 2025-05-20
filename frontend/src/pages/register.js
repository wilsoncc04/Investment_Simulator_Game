import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});
function Register() {
  const navigate = useNavigate();

  // Initial form values
  const initialValues = {
    username: "",
    password: "",
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await axios.post("http://localhost:3001/auth", values);
      if (response.data === "success") {
        alert("Registration successful! Redirecting to login...");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setFieldError("username", "Username already exists");
      } else {
        alert("Failed to register. Please try again.");
      }
    }
  };

  return (
    <div className="register-container">
      <h2 className="registerTitle">Register</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="w-50 mx-auto">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <Field
                type="text"
                name="username"
                id="username"
                className="form-control"
                placeholder="Enter username"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Field
                name="password"
                id="password"
                className="form-control"
                placeholder="Enter password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Register;
