import React from "react";
import { MdSettings, MdGroup, MdRateReview, MdMenu } from "react-icons/md";
import { FaBullhorn } from "react-icons/fa";
import { BsBellFill, BsFillTagFill } from "react-icons/bs";
const menuItems = [
  { name: "Settings", icon: MdSettings },
  { name: "User Management", icon: MdGroup },
  { name: "Reviews & Comments", icon: MdRateReview },
  { name: "Announcements", icon: FaBullhorn },
  { name: "Promotions", icon: BsFillTagFill },
  { name: "Notifications", icon: BsBellFill },
];

const LeftSideMenu = ({ section, setSection, setMenu = () => {} }) => {
  return (
    <div className="row no-gutters bg-dark text-white py-5 h-100">
      <div className="col-60">
        <div className="row no-gutters justify-content-between d-flex d-lg-none px-5 mb-4">
          <div className="col-auto h3">Logo</div>
          <div className="col-auto">
            <MdMenu
              className="cursor-pointer"
              fontSize="34px"
              onClick={() => {
                setMenu((prev) => !prev);
              }}
            ></MdMenu>
          </div>
        </div>
        {menuItems.map((x, i) => (
          <div
            className="row no-gutters px-5 mb-2"
            style={{
              borderLeft:
                section === i
                  ? "4px solid rgb(255, 0, 64)"
                  : "4px solid transparent",
            }}
          >
            <div className="col-60">
              <div
                onClick={() => setSection(i)}
                key={`menu-item-${i}`}
                className={`align-items-center px-3 btn-custom text-left row no-gutters${
                  section === i ? " bg-custom-primary" : ""
                }`}
              >
                <x.icon className="col-auto mr-2" fontSize="24px"></x.icon>
                <div className="col-auto">{x.name}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSideMenu;
