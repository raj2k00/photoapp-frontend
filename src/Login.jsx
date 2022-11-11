import React, { useState } from "react";
import "./Global.scss";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import useUserStore from "./store/userStore";
import { Oval } from "react-loader-spinner";
import { APP_URL } from "./constant";
import { toast } from "react-toastify";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUserDetails } = useUserStore();
  const [cookies, setCookie] = useCookies(["jwt"]);
  const navigate = useNavigate();
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    const { email, password } = values;
    console.log(values);
    axios
      .post(`${APP_URL}users/login`, {
        email,
        password,
      })
      .then((res) => {
        console.log(res);
        setCookie("jwt", res.data.token, { path: "/" });
        setUserDetails(res.data.data.user);
        setLoading(false);
        navigate("/home");
      })
      .catch((e) => {
        console.log(e);
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
            <div className="heading__container--heading">Welcome back!</div>
            <span className="heading__container--para">
              Please Enter your details
            </span>
          </div>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={loginSchema}
          >
            {({ touched, isValid, isSubmitting, values, dirty }) => (
              <Form>
                <div className="form login-form">
                  <div className="form-group">
                    <label htmlFor="email" className="form-group__label">
                      Email Address
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="form-group__input"
                      placeholder="Enter your email"
                      autoComplete="off"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="form-group__label">
                      Password
                    </label>
                    <div className="eye">
                      <Field
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-group__input "
                        placeholder="Enter your name"
                        autoComplete="off"
                      />
                      <img
                        onClick={toggleShowPassword}
                        className="eye-image"
                        src="./eye.png"
                        alt="eye"
                      />
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
                    Remember me
                    <span> Forgot Password?</span>
                  </label>
                </div>
                <div>
                  <button
                    className="form-button"
                    type="submit"
                    onClick={() => handleSubmit(values)}
                    disabled={!isValid || !dirty || loading}
                  >
                    {!loading ? (
                      "Login"
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
                </div>
              </Form>
            )}
          </Formik>
          <div className="login-text">
            Don't have a Account?
            <Link className="login-text__link" to="/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
