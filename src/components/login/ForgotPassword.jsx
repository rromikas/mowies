import React, { useState } from "react";
import history from "../../History";
import { SendPasswordResetLink } from "../../server/DatabaseApi";
import store from "../../store/store";
import Logo from "../../images/Logo";
import { BsChevronLeft } from "react-icons/bs";
import { validateEmail } from "../../utilities/Functions";

const Login = () => {
  const [email, setEmail] = useState("");
  const [problem, setProblem] = useState("");
  const handleSubmit = async (email) => {
    if (!validateEmail(email)) {
      setProblem("Email is not valid");
    } else {
      let res = await SendPasswordResetLink(email);
      if (res.error) {
        store.dispatch({
          type: "SET_NOTIFICATION",
          notification: {
            type: "failure",
            title: "Error",
            message: res.error,
          },
        });
      } else {
        store.dispatch({
          type: "SET_NOTIFICATION",
          notification: {
            type: "success",
            title: "Password reset link sent",
            message:
              "We sent email with password reset link to your email box. If you didn't get email, check spam folder",
          },
        });
        history.push("/login");
      }
    }
  };

  return (
    <div
      className="row no-gutters justify-content-center aligm-items-start align-items-sm-center"
      style={{ height: window.innerHeight }}
    >
      <div className="col-xl-50 col-60 col-lg-50 col-md-30 col-sm-40 login-rounded overflow-hidden">
        <div className="row no-gutters h-100">
          <div className="col bg-dark d-lg-block d-none">
            <div className="row no-gutters h-100 flex-center position-relative">
              <div
                className="position-absolute d-flex align-items-center text-white cursor-pointer"
                onClick={() => history.push("/")}
                style={{ top: "15px", left: "15px" }}
              >
                <BsChevronLeft className="mr-2"></BsChevronLeft>Back to home
              </div>
              <div className="col-auto">
                <div className="square-150 mx-auto">
                  <Logo></Logo>
                </div>
                <div className="logo text-title-xl text-white">CozyPotato</div>
              </div>
            </div>
          </div>
          <div
            className="col-60 col-lg-30 col-xl-25 col-md-auto p-sm-5 p-4 bg-light"
            style={{
              minHeight: window.innerHeight - 100,
            }}
          >
            <div className="row no-gutters h-100 py-3 align-items-center">
              <div className="col-60">
                <div className="row no-gutters mb-4">
                  <div className="col-60 h3 mb-2">Forgot Password?</div>
                  <div className="col-60">
                    Enter email where you want to receive password reset link.
                  </div>
                </div>
                <div className="row no-gutters justify-content-center mb-4">
                  <div className="col-60 mb-1">Email</div>
                  <div className="col-60">
                    <input
                      type="text"
                      className="input-light w-100 px-3"
                      value={email}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          handleSubmit(email);
                        }
                      }}
                      onChange={(e) => {
                        e.persist();
                        setEmail(e.target.value);
                      }}
                    ></input>
                  </div>
                </div>
                <div className="row no-gutters mb-1">
                  <div
                    className="col-60 btn-custom btn-custom-primary"
                    onClick={() => handleSubmit(email)}
                  >
                    Send me reset link
                  </div>
                </div>
                <div
                  style={{ height: "40px", opacity: problem ? 1 : 0 }}
                  className="row no-gutters align-items-center text-danger"
                >
                  {problem}
                </div>
                <div className="row no-gutters justify-content-end">
                  <div
                    className="btn-link col-auto mr-3"
                    onClick={() => history.push("/login")}
                  >
                    Login
                  </div>
                  <div
                    className="btn-link col-auto"
                    onClick={() => history.push("/signup")}
                  >
                    Sign up
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
