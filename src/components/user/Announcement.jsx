import React, { useEffect, useState } from "react";
import { GetActiveAnnouncements } from "../../server/DatabaseApi";

const Announcement = () => {
  const [announcement, setAnnouncement] = useState({
    type: "",
    description: "",
  });
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

  return description ? (
    <div
      className={`row p-2 no-gutters justify-content-center ${
        type === "Warning"
          ? "bg-warning"
          : type === "Information"
          ? "bg-primary"
          : type === "Error"
          ? "bg-danger"
          : ""
      }`}
    >
      <div className="col-60 content-container text-white">
        <div className="row no-gutters justify-content-center">
          <div className="col-auto mr-2">{description}</div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default Announcement;
