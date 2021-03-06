import React, { useEffect, useState } from "react";
import { GetActiveAnnouncements } from "../../server/DatabaseApi";
import { BsX } from "react-icons/bs";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);

  let notClosedAnnouncement = false;

  let closedAnnouncements = localStorage.getItem("closed_movies_announcements");

  if (closedAnnouncements) {
    closedAnnouncements = JSON.parse(closedAnnouncements);
  } else {
    closedAnnouncements = [];
  }

  for (let x of announcements) {
    if (!closedAnnouncements.includes(x.description)) {
      notClosedAnnouncement = x;
      break;
    }
  }

  const [closed, setClosed] = useState(false);

  useEffect(() => {
    async function getData() {
      let data = await GetActiveAnnouncements();
      if (!data.error) {
        if (data.length) {
          setAnnouncements(data);
        }
      }
    }

    getData();
  }, []);

  return notClosedAnnouncement &&
    notClosedAnnouncement.description &&
    !closed ? (
    <div
      className={`row p-2 position-relative no-gutters justify-content-center ${
        notClosedAnnouncement.type === "Warning"
          ? "bg-warning"
          : notClosedAnnouncement.type === "Information"
          ? "bg-primary"
          : notClosedAnnouncement.type === "Error"
          ? "bg-danger"
          : ""
      }`}
    >
      <div
        onClick={() => {
          setClosed(true);
          closedAnnouncements.push(notClosedAnnouncement.description);

          localStorage.setItem(
            "closed_movies_announcements",
            JSON.stringify(closedAnnouncements)
          );
        }}
        className="square-20 rounded-circle d-flex flex-center bg-white cursor-pointer scale-transition position-absolute"
        style={{ right: "10px", top: 0, bottom: 0, margin: "auto", zIndex: 5 }}
      >
        <BsX className="text-dark"></BsX>
      </div>
      <div className="col-60 content-container text-white">
        <div className="row no-gutters justify-content-center">
          <div
            className="col-auto mr-2 d-none d-md-block"
            style={{ width: "30px" }}
          ></div>
          <div className="col mr-2 pl-2 pl-md-0">
            <div className="row no-gutters justify-content-center">
              {notClosedAnnouncement.description}
            </div>
          </div>
          <div className="col-auto" style={{ width: "30px" }}></div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default Announcement;
