import React, { useEffect } from "react";
import { BsX } from "react-icons/bs";

const Modal = (props) => {
  useEffect(() => {
    if (props.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }
  }, [props.open]);

  let mobileCloserColor = props.mobileCloserColor
    ? props.mobileCloserColor
    : "white";

  let desktopCloserColor = props.desktopCloserColor
    ? props.desktopCloserColor
    : "white";

  return (
    <div
      className={`container-fluid w-100 h-100 modal-container px-0 overflow-auto${
        !props.open ? " d-none" : ""
      }`}
    >
      <div
        className="row no-gutters justify-content-end d-md-flex d-none"
        style={{ position: "sticky", top: 0, zIndex: 55 }}
      >
        <div
          onClick={props.onClose}
          className="modal-closer"
          style={{ color: desktopCloserColor }}
        >
          <BsX fontSize="24px" strokeWidth="2px"></BsX>
        </div>
      </div>
      <div
        className="row no-gutters justify-content-end d-flex d-md-none"
        style={{ position: "sticky", top: 0, zIndex: 55 }}
      >
        <div
          onClick={props.onClose}
          className="modal-closer d-md-none d-block"
          style={{ color: mobileCloserColor }}
        >
          <BsX fontSize="24px" strokeWidth="2px"></BsX>
        </div>
      </div>
      <div className="row no-gutters h-100 align-items-center justify-content-center">
        {React.cloneElement(
          props.children,
          Object.assign({}, props.children.props, { modalOpened: props.open })
        )}
      </div>
    </div>
  );
};

export default Modal;
