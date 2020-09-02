import React, { useState } from "react";
import history from "../../History";
import { Login as LoginFunction } from "../../server/DatabaseApi";
import store from "../../store/store";
import Logo from "../../images/Logo";
import { BsChevronLeft } from "react-icons/bs";

const handleSubmit = async (credentials) => {
  let res = await LoginFunction(credentials);
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
    localStorage.setItem("movies_user_token", res.token);
    store.dispatch({ type: "SET_USER", user: res });
    history.push("/");
  }
};

const Login = () => {
  console.log("inne height", window.innerHeight);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            <div className="row no-gutters h-100 py-3">
              <div className="col-60 d-flex align-items-start flex-wrap mb-5">
                <div className="row no-gutters">
                  <div className="col-60 h3 mb-3">Hello, welcome back</div>
                  <div className="col-60">
                    Login to your account to review movies and interact with
                    movies community
                  </div>
                </div>
              </div>
              <div className="col-60 d-flex align-items-end flex-wrap">
                <div className="row no-gutters w-100">
                  <div className="col-60">
                    <div className="row no-gutters justify-content-center mb-4">
                      <div className="col-60 mb-1">Email</div>
                      <div className="col-60">
                        <input
                          type="text"
                          className="input-light w-100 px-3"
                          value={email}
                          onChange={(e) => {
                            e.persist();
                            setEmail(e.target.value);
                          }}
                        ></input>
                      </div>
                    </div>
                    <div className="row no-gutters mb-4">
                      <div className="col-60 mb-1">Password</div>
                      <div className="col-60">
                        <input
                          type="password"
                          className="input-light w-100 px-3"
                          value={password}
                          onChange={(e) => {
                            e.persist();
                            setPassword(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              handleSubmit({ email, password });
                            }
                          }}
                        ></input>
                      </div>
                    </div>
                    <div className="row no-gutters mb-4">
                      <div
                        className="col-60 btn-custom btn-custom-primary"
                        onClick={() => handleSubmit({ email, password })}
                      >
                        Login
                      </div>
                    </div>
                    <div
                      className="row no-gutters justify-content-between"
                      style={{ fontSize: "14px" }}
                    >
                      <div className="col-auto mr-4">
                        Don't have an account?{" "}
                        <span
                          className="btn-link cursor-pointer"
                          onClick={() => history.push("/signup")}
                        >
                          Sign up
                        </span>
                      </div>
                      <div
                        className="col-auto btn-link cursor-pointer"
                        onClick={() => history.push("/forgot-password")}
                      >
                        Forgot password
                      </div>
                    </div>
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
