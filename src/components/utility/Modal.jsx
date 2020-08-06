import React, { useEffect } from "react";
import { BsX } from "react-icons/bs";

const Modal = (props) => {
  useEffect(() => {
    if (props.open) {
      document.getElementById("root").style.overflow = "hidden";
    } else {
      document.getElementById("root").style.overflow = "visible";
    }
  }, [props.open]);

  return props.open ? (
    <div className="container-fluid w-100 h-100 modal-container px-0 text-white overflow-auto">
      <div
        className="row no-gutters justify-content-end"
        style={{ position: "sticky", top: 0 }}
      >
        <div onClick={props.onClose} className="modal-closer">
          <BsX fontSize="24px" strokeWidth="2px"></BsX>
        </div>
      </div>
      <div className="row no-gutters h-100 align-items-center justify-content-center">
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default Modal;
