import React from "react";
import { confirmable } from "react-confirm";
import { BsX } from "react-icons/bs";

const YourDialog = ({ show, proceed, confirmation, options }) => {
  return show ? (
    <div
      className="container-fluid"
      style={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        zIndex: "100",
        top: 0,
        left: 0,
        transition: "opacity 0.3s",
        display: show ? "block" : "none",
      }}
    >
      <div className="row no-gutters align-items-center justify-content-center h-100 p-3">
        <div className="col-auto position-relative p-5 confirm-pro bg-over-root">
          <div
            style={{ position: "absolute", top: "10px", right: "10px" }}
            className="toast-close-icon"
            onClick={() => proceed(false)}
          >
            <BsX fontSize="24px" className="text-white"></BsX>
          </div>
          <div className="row no-gutters text-light justify-content-center mb-4 mt-2">
            {confirmation}
          </div>
          <div className="row no-gutters justify-content-center">
            <div
              className="col-auto btn-custom btn-custom-primary btn-small mx-1 mb-2"
              onClick={() => proceed(true)}
            >
              Submit
            </div>
            <div
              className="col-auto btn-custom btn-custom-secondary btn-small mx-1 mb-2"
              onClick={() => proceed(false)}
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default confirmable(YourDialog);
