import React from "react";
import { MdSettings, MdGroup, MdRateReview, MdMenu } from "react-icons/md";
import { FaBullhorn } from "react-icons/fa";
import { BsBellFill, BsFillTagFill } from "react-icons/bs";
import store from "../../store/store";
import Logo from "../../images/Logo";

const menuItems = [
  { name: "Settings", icon: MdSettings },
  { name: "User Management", icon: MdGroup },
  { name: "Reviews & Comments", icon: MdRateReview },
  { name: "Announcements", icon: FaBullhorn },
  { name: "Promotions", icon: BsFillTagFill },
  { name: "Notifications", icon: BsBellFill },
];

const LeftSideMenu = ({ section, setSection, isMenuOpened }) => {
  return (
    <div className="row no-gutters bg-over-root-lighter text-white h-100 admin-menu">
      <div className="col-60">
        <div className="row no-gutters justify-content-between align-items-center d-flex d-lg-none px-5 mb-4">
          <div className="col-auto h3">
            <div className="row no-gutters align-items-center">
              <div className="square-50 mr-2">
                <Logo></Logo>
              </div>
              <div className="col-auto logo text-title-lg">CozyPotato</div>
            </div>
          </div>
          <div className="col-auto">
            <MdMenu
              className="cursor-pointer"
              fontSize="34px"
              onClick={() => {
                store.dispatch({
                  type: "SET_DASHBOARD_MENU_OPENED",
                  isOpened: !isMenuOpened,
                });
              }}
            ></MdMenu>
          </div>
        </div>
        {menuItems.map((x, i) => (
          <div
            key={`left-menu-item-${i}`}
            className="row no-gutters px-4 mb-2"
            style={{
              borderLeft:
                section === i
                  ? "4px solid rgb(255, 0, 64)"
                  : "4px solid transparent",
            }}
          >
            <div className="col-60">
              <div
                onClick={() => {
                  setSection(i);
                  store.dispatch({
                    type: "SET_DASHBOARD_MENU_OPENED",
                    isOpened: !isMenuOpened,
                  });
                }}
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
