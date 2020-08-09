import React, { useEffect, useState } from "react";
import { GetActiveAnnouncements } from "../../server/DatabaseApi";
import { BsX } from "react-icons/bs";

const Announcement = () => {
  const [announcement, setAnnouncement] = useState({
    type: "",
    description: "",
  });

  let haveUserClosedThisAnnouncement = false;

  let closedAnnouncements = localStorage.getItem(
    "movies_announcement_closed_by_user"
  );

  if (closedAnnouncements) {
    closedAnnouncements = JSON.parse(closedAnnouncements);
  } else {
    closedAnnouncements = [];
  }

  if (closedAnnouncements.includes(announcement.description)) {
    haveUserClosedThisAnnouncement = true;
  }
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    async function getData() {
      let data = await GetActiveAnnouncements();
      if (!data.error) {
        if (data.length) {
          setAnnouncement(data[0]);
        }
      }
    }

    getData();
  }, []);

  const type = announcement.type;
  const description = announcement.description;

  return description && !closed && !haveUserClosedThisAnnouncement ? (
    <div
      className={`row p-2 position-relative no-gutters justify-content-center ${
        type === "Warning"
          ? "bg-warning"
          : type === "Information"
          ? "bg-primary"
          : type === "Error"
          ? "bg-danger"
          : ""
      }`}
    >
      <div
        onClick={() => {
          setClosed(true);
          closedAnnouncements.push(announcement.description);

          localStorage.setItem(
            "movies_announcement_closed_by_user",
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
              {description}
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
