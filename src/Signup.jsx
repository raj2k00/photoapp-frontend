import React, { useState, useEffect } from "react";
import "./Global.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Oval } from "react-loader-spinner";
import useUserStore from "./store/userStore";
import { APP_URL } from "./constant";

const Signup = () => {
  const [cookies, setCookie] = useCookies(["jwt"]);
  const [loading, setLoading] = useState(false);
  const { setUserDetails } = useUserStore();
  const user = useUserStore((state) => state.userDetails);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies) {
      if (cookies.jwt && Object.keys(user).length === 0) navigate("/home");
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SignUpSchema = Yup.object().shape({
    fname: Yup.string()
      .required("First Name is required")
      .min(4, "First Name must have atleast 4 letters")
      .max(20, "Max 20 letters"),
    lname: Yup.string()
      .required("Last Name is required")
      .min(1, "Last Name must have atleast 1 character")
      .max(20, "Max 20 characters"),
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be 8 characters at minimum")
      .required("Password is required"),
    phoneNumber: Yup.string()
      .required("phoneNumber is required")
      .min(8, "Minimum 8 digits is required")
      .max(10, "Maximum 10 digits allowed"),
  });

  const handleSubmit = async (values, resetForm) => {
    setLoading(true);
    const { fname, lname, email, phoneNumber, password } = values;
    const phone = phoneNumber.toString();
    axios
      .post(`${APP_URL}users/signup`, {
        fname,
        lname,
        email,
        phoneNumber: phone,
        password,
      })
      .then(async (res) => {
        resetForm();
        console.log(res);
        setLoading(false);
        setCookie("jwt", res.data.token, { path: "/" });
        setUserDetails(res.data.data.user);
        toast("Please verify your email", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/login");
      })
      .catch((e) => {
        console.log(e.response.data.message);
        toast(e.response.data.message, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
        // resetForm();
      });
  };

  return (
    <div className="signup">
      <div className="signup-left">
        <div className="welcome-text">
          <span className="welcome-text--heading">Welcome to Rsquare</span>
          <span className="welcome-text--para">
            Lets get you all set up so start with your account and begin setting
            up your profile.
          </span>
        </div>
      </div>
      <div className="signup-right">
        <div className="signup-right--content">
          <div className="heading__container">
            <div className="heading__container--heading">
              Begin your journey!
            </div>
            <span className="heading__container--para">
              Get started with the best platform for design
            </span>
          </div>
          <Formik
            initialValues={{
              fname: "",
              lname: "",
              phoneNumber: "",
              email: "",
              password: "",
            }}
            validationSchema={SignUpSchema}
          >
            {({ isValid, values, resetForm }) => (
              <Form>
                <div className="form">
                  <div className="form-group">
                    <label htmlFor="fname" className="form-group__label">
                      First Name*
                    </label>
                    <Field
                      type="text"
                      name="fname"
                      className="form-group__input"
                      placeholder="Enter your First Name"
                      autoComplete="off"
                    />
                    <div className="form-error">
                      <ErrorMessage name="fname" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="lname" className="form-group__label">
                      Last Name*
                    </label>
                    <Field
                      type="text"
                      name="lname"
                      className="form-group__input"
                      placeholder="Enter your Last Name"
                      autoComplete="off"
                    />
                    <div className="form-error">
                      <ErrorMessage name="lname" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-group__label">
                      Email Address*
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="form-group__input"
                      placeholder="Enter your email"
                      autoComplete="off"
                    />
                    <div className="form-error">
                      <ErrorMessage name="email" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-group__label">
                      Phone Number*
                    </label>
                    <Field
                      type="number"
                      name="phoneNumber"
                      minLength={10}
                      maxLength={10}
                      className="form-group__input"
                      placeholder="12345-67890"
                      autoComplete="off"
                    />
                    <div className="form-error">
                      <ErrorMessage name="phoneNumber" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="form-group__label">
                      Password*
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="form-group__input"
                      placeholder="Enter your name"
                      autoComplete="off"
                    />
                    <div className="form-error">
                      <ErrorMessage name="password" />
                    </div>
                  </div>
                </div>
                <div className="form-checkbox">
                  <input
                    className="form-checkbox__input"
                    type="checkbox"
                    id="checkbox"
                    name="checkbox"
                    value="true"
                  />
                  <label className="form-checkbox__label" htmlFor="checkbox">
                    By signing up, you agree to our
                    <span>
                      User Agreement, Terms of Service, & Privacy Policy
                    </span>
                  </label>
                </div>
                <button
                  className="form-button"
                  type="submit"
                  onClick={() => handleSubmit(values, resetForm)}
                  disabled={!isValid || loading}
                >
                  {!loading ? (
                    "sign up"
                  ) : (
                    <div className="btn-loader">
                      <Oval
                        height={25}
                        width={25}
                        color="white"
                        visible={true}
                        ariaLabel="oval-loading"
                        secondaryColor="grey"
                        strokeWidth={4}
                        strokeWidthSecondary={4}
                      />
                    </div>
                  )}
                </button>
              </Form>
            )}
          </Formik>
          <div className="login-text">
            Already have a account?
            <Link className="login-text__link" to="/login">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
