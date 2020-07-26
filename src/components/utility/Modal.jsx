import React from "react";
import { BsX } from "react-icons/bs";

const Modal = (props) => {
  return props.open ? (
    <div className="container-fluid w-100 h-100 modal-container px-0">
      <div className="row no-gutters h-100 align-items-center justify-content-center">
        <div onClick={props.onClose} className="modal-closer">
          <BsX fontSize="24px" strokeWidth="2px"></BsX>
        </div>
        {props.children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default Modal;
