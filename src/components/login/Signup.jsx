import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import history from "../../History";
import { Signup as SignupFunction } from "../../server/DatabaseApi";
import { validateEmail } from "../../utilities/Functions";
import store from "../../store/store";
import Logo from "../../images/Logo";
import Checkbox from "../utility/Checkbox";
import Modal from "../utility/Modal";
import LegalDocument from "../user/LegalDocument";
import { BsChevronLeft } from "react-icons/bs";
import { connect } from "react-redux";

const Signup = ({ no_display_name_characters, captcha_api_key }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [agreedWithPolicies, setAgreedWithPolicies] = useState(false);
  const [problem, setProblem] = useState("");
  const [legalDocument, setLegalDocument] = useState("");

  const validations = [
    { valid: validateEmail(email), error: "Email is not valid" },
    {
      valid: email.split("@")[0].length < no_display_name_characters,
      error: "Email is too long",
    },
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
    {
      valid: validated,
      error: "Pass captcha validation",
    },

    {
      valid: agreedWithPolicies,
      error: "Check if you agree with privacy policy and terms and conditions",
    },
  ];

  const handleSubmit = async () => {
    let notValid = validations.filter((x) => !x.valid);
    if (notValid.length === 0) {
      let res = await SignupFunction({ email, password });
      if (res.success) {
        store.dispatch({
          type: "SET_NOTIFICATION",
          notification: {
            title: "Account created!",
            message:
              "Login to start writing reviews and comments about your favorite movies",
            type: "success",
          },
        });

        store.dispatch({
          type: "UPDATE_PUBLICUSERS",
          publicUser: { [res.publicUser.user_id]: res.publicUser },
        });
        history.push("/login");
      } else {
        store.dispatch({
          type: "SET_NOTIFICATION",
          notification: {
            message: res.error,
            type: "failure",
            title: "Failed create account",
          },
        });
      }
    } else {
      setProblem(notValid[0].error);
    }
  };

  return (
    <div
      className="row no-gutters justify-content-center aligm-items-start align-items-sm-center py-sm-3"
      style={{ minHeight: window.innerHeight }}
    >
      <Modal open={legalDocument} onClose={() => setLegalDocument("")}>
        <LegalDocument type={legalDocument}></LegalDocument>
      </Modal>
      <div className="col-xl-50 col-60 col-lg-50 col-md-30 col-sm-40 login-rounded overflow-hidden">
        <div className="row no-gutters h-100">
          <div className="col bg-dark d-lg-block d-none text-center">
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
            className="col-60 col-lg-30 col-xl-25 col-md-auto p-4 p-sm-5 bg-light"
            style={{
              minHeight: window.innerHeight - 100,
            }}
          >
            <div className="row no-gutters h-100">
              <div className="col-60 d-flex align-items-start flex-wrap">
                <div className="row no-gutters">
                  <div className="col-60 h3 mb-3">Create Account</div>
                  {/* <div className="col-60">
                    By creating account you will be joining milions of people on
                    the largest movies reviewing platform
                  </div> */}
                </div>
              </div>
              <div className="col-60 d-flex align-items-end flex-wrap">
                <div className="row no-gutters w-100">
                  <div className="col-60">
                    <div className="row no-gutters justify-content-center mb-3">
                      <div className="col-60 mb-1">Email</div>
                      <div className="col-60">
                        <input
                          type="email"
                          className="input-light w-100 px-3"
                          value={email}
                          onChange={(e) => {
                            e.persist();
                            setEmail(e.target.value);
                          }}
                        ></input>
                      </div>
                    </div>
                    <div className="row no-gutters mb-3">
                      <div className="col-60 mb-1">Password</div>
                      <div className="col-60 mb-1">
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
                      <div className="col-60 text-muted font-size-14">
                        Must be at least 6 characters and must contain number or
                        symbol
                      </div>
                    </div>
                    <div className="row no-gutters mb-3">
                      <div className="col-60 mb-1">Confirm Password</div>
                      <div className="col-60 mb-1">
                        <input
                          type="password"
                          className="input-light w-100 px-3"
                          value={confirmPassword}
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              handleSubmit();
                            }
                          }}
                          onChange={(e) => {
                            e.persist();
                            setConfirmPassword(e.target.value);
                          }}
                        ></input>
                      </div>
                      <div className="col-60 text-muted font-size-14">
                        Must be at least 6 characters and must contain number or
                        symbol
                      </div>
                    </div>
                    <div className="row no-gutters mb-3">
                      <ReCAPTCHA
                        sitekey={captcha_api_key}
                        onChange={(value) => {
                          if (value) {
                            setValidated(true);
                          }
                        }}
                      />
                    </div>
                    <div className="row no-gutters">
                      <div className="col-auto mr-2">
                        <Checkbox
                          color={"primary"}
                          checked={agreedWithPolicies}
                          onChange={(e) => {
                            setAgreedWithPolicies(e.target.checked);
                          }}
                        ></Checkbox>
                      </div>
                      <div className="col">
                        By registering you agree with{" "}
                        <span
                          onClick={() =>
                            setLegalDocument("terms-and-conditions")
                          }
                          className="btn-link"
                        >
                          terms and conditions
                        </span>{" "}
                        and{" "}
                        <span
                          className="btn-link"
                          onClick={() => setLegalDocument("privacy-policy")}
                        >
                          privacy policy
                        </span>
                      </div>
                    </div>
                    <div
                      style={{ height: "40px", opacity: problem ? 1 : 0 }}
                      className="row no-gutters align-items-center text-danger"
                    >
                      {problem}
                    </div>
                    <div className="row no-gutters mb-3">
                      <div
                        className="col-60 btn-custom btn-custom-primary"
                        onClick={handleSubmit}
                      >
                        Create Account
                      </div>
                    </div>
                    <div
                      className="row no-gutters justify-content-end"
                      style={{ fontSize: "14px" }}
                    >
                      <div className="col-auto">
                        Already have account?{" "}
                        <span
                          className="btn-link cursor-pointer"
                          onClick={() => history.push("/login")}
                        >
                          Login
                        </span>
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

function mapp(state, ownProps) {
  return {
    captcha_api_key: state.settings.captcha_api_key,
    no_display_name_characters: state.settings.no_display_name_characters,
    ...ownProps,
  };
}

export default connect(mapp)(Signup);
