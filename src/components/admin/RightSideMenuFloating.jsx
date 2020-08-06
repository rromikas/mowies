import React from "react";
import LeftSideMenu from "./LeftSideMenu";

const RightSideMenuFloating = ({ isMenuOpened, setSection, section }) => {
  return (
    <div
      className={`d-block d-lg-none col-60 col-sm-40 col-md-30 col-lg-20 col-xl-15 vh-100 zindex-99 ${
        !isMenuOpened ? "zindex-0-1" : ""
      }`}
      style={{
        position: "fixed",
        right: 0,
        top: 0,
      }}
    >
      <div className="w-100 h-100 position-relative">
        <div
          className="container-fluid px-0"
          style={{
            height: "100%",
            width: "100%",
            right: isMenuOpened ? 0 : "-100%",
            transition: "right 0.3s",
            position: "absolute",
            zIndex: 10,
            background: "white",
          }}
        >
          <LeftSideMenu
            mobile={true}
            className="text-white bg-internly-90 col-12"
            section={section}
            isMenuOpened={isMenuOpened}
            setSection={setSection}
          ></LeftSideMenu>
        </div>
      </div>
    </div>
  );
};

export default RightSideMenuFloating;
