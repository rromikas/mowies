import React, { useState, useRef } from "react";
import history from "../../History";
import { ResetPassword } from "../../server/DatabaseApi";
import store from "../../store/store";
import Logo from "../../images/Logo";
import { BsChevronLeft } from "react-icons/bs";

const ResetPasswordPage = (props) => {
  let token = props.match.params.token;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [problem, setProblem] = useState("");
  const initialHeight = useRef(window.innerHeight);
  const validations = [
    {
      valid: /[^\w\s]/.test(password) || /\d/.test(password),
      error: "Password must contain number or symbol",
    },
    {
      valid: password === confirmPassword,
      error: "Passwords don't match",
    },
    {
      valid: password.length >= 6,
      error: "Password must contain at least 6 characters",
    },
  ];
  const handleSubmit = async (password, token) => {
    let notValid = validations.filter((x) => !x.valid);
    if (notValid.length === 0) {
      let res = await ResetPassword(password, token);
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
            title: "Password reseted",
            message: "Password successfully changed. You can login",
          },
        });
        history.push("/login");
      }
    } else {
      setProblem(notValid[0].error);
    }
  };
  return (
    <div
      className="row no-gutters justify-content-center aligm-items-start align-items-sm-center"
      style={{ minHeight: initialHeight.current }}
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
                  <div className="col-60 h3 mb-2">Reset Password</div>
                  <div className="col-60">
                    Enter new password in input fields
                  </div>
                </div>
                <div className="row no-gutters justify-content-center mb-4">
                  <div className="col-60 mb-1">New Password</div>
                  <div className="col-60">
                    <input
                      type="password"
                      className="input-light w-100 px-3"
                      value={password}
                      onChange={(e) => {
                        e.persist();
                        setPassword(e.target.value);
                      }}
                    ></input>
                  </div>
                </div>
                <div className="row no-gutters justify-content-center mb-4">
                  <div className="col-60 mb-1">Confirm New Password</div>
                  <div className="col-60">
                    <input
                      type="password"
                      className="input-light w-100 px-3"
                      value={confirmPassword}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13) {
                          handleSubmit(password, token);
                        }
                      }}
                      onChange={(e) => {
                        e.persist();
                        setConfirmPassword(e.target.value);
                      }}
                    ></input>
                  </div>
                </div>
                <div className="row no-gutters mb-1">
                  <div
                    className="col-60 btn-custom btn-custom-primary"
                    onClick={() => handleSubmit(password, token)}
                  >
                    Set new password
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

export default ResetPasswordPage;
