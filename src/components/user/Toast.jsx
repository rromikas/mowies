import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import store from "../../store/store";
import { BsCheck, BsExclamation, BsX } from "react-icons/bs";
import { CreateNotification } from "../../server/DatabaseApi";

const Toast = ({ notification, publicUsers }) => {
  const [hovered, setHovered] = useState(false);
  const [expired, setExpired] = useState(false);
  useEffect(() => {
    let timeout;
    if (!notification.expired) {
      timeout = setTimeout(() => {
        setExpired(true);
      }, 5000);
    }

    return function cleanUp() {
      if (!notification.expired && timeout) {
        clearTimeout(timeout);
      }
    };
  }, [notification]);

  useEffect(() => {
    if (expired && !hovered) {
      store.dispatch({
        type: "UPDATE_NOTIFICATION",
        notification: { expired: true },
      });
      setExpired(false);
    }
  }, [expired, hovered]);

  useEffect(() => {
    if (
      notification.type !== "success" &&
      typeof notification.message === "object"
    ) {
      let adminNotification = {
        type: "System",
        subject: "System error occured",
        receivers: ["All admins"],
        start_date: Date.now(),
        end_date: Date.now(),
        description: JSON.stringify(notification.message).replace(/"/g, ""),
        status: "Sent",
      };
      CreateNotification(adminNotification);
    }
  }, [notification.message]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="container-fluid toast-pro bg-over-root px-0"
      style={{
        maxWidth: "300px",
        bottom: notification.expired ? "-100%" : "50px",
      }}
    >
      <div className="row no-gutters p-3">
        {notification.type && (
          <div className="col-auto pr-2">
            {notification.type === "success" ? (
              <BsCheck
                strokeWidth="1px"
                fontSize="24px"
                className="text-success"
              ></BsCheck>
            ) : (
              <BsExclamation
                strokeWidth="1px"
                fontSize="24px"
                className="text-primary"
              ></BsExclamation>
            )}
          </div>
        )}
        <div className="col pr-2 toast-title">{notification.title}</div>
        <div
          className="col-auto toast-close-icon"
          onClick={() =>
            store.dispatch({
              type: "UPDATE_NOTIFICATION",
              notification: { expired: true },
            })
          }
        >
          <BsX fontSize="24px" className="text-white"></BsX>
        </div>
      </div>

      <div className="row no-gutters p-4 text-white">
        {notification.type !== "success"
          ? typeof notification.message === "object"
            ? "Action failed"
            : notification.message
          : notification.message}
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    publicUsers: state.publicUsers,
    notification: state.notification,
    ...ownProps,
  };
}

export default connect(mapp)(Toast);
