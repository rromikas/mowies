import React, { useEffect, useState, useRef } from "react";
import { MdMenu } from "react-icons/md";
import { BsSearch, BsChevronDown } from "react-icons/bs";
import Notifications from "../../images/Notifications";
import { PublicUsers } from "../../Data";
import Popover from "../utility/Popover";

const Navbar = ({ setIsMenuOpened, isMenuOpened }) => {
  const lastScroll = useRef(100);
  const [direction, setDirection] = useState("up");

  useEffect(() => {
    function handleScrolling() {
      let scrollY = window.scrollY;
      if (lastScroll.current < scrollY) {
        setDirection("down");
      } else {
        setDirection("up");
      }
      lastScroll.current = scrollY;
    }
    window.addEventListener("scroll", handleScrolling);

    return () => {
      window.removeEventListener("scroll", handleScrolling);
    };
  }, []);

  return (
    <div
      className="row no-gutters justify-content-between bg-dark py-4 pr-4 align-items-center w-100"
      style={{
        position: "fixed",
        zIndex: 59,
        transition: "top 0.3s",
        top: direction === "up" ? "0px" : "-110px",
        left: 0,
      }}
    >
      <div className="col">
        <div className="row no-gutters align-items-center">
          <div
            className="col-auto text-center text-white h3 d-xl-block d-none"
            style={{ width: "350px" }}
          >
            WEBSITE LOGO
          </div>
          <div className="col px-3 d-sm-block d-none">
            <div className="row no-gutters position-relative w-100 align-items-center">
              <BsSearch
                fontSize="24px"
                style={{
                  position: "absolute",
                  left: "18px",
                  top: 0,
                  bottom: 0,
                  margin: "auto",
                  color: "white",
                }}
              ></BsSearch>
              <input type="text" className="input-search-admin w-100"></input>
            </div>
          </div>
        </div>
      </div>

      <div className="col-auto">
        <div className="row no-gutters align-items-center">
          <div className="col-auto mr-3">
            <Notifications fontSize="44px"></Notifications>
          </div>
          <div className="col-auto mr-3">
            <div className="row no-gutters bg-dark-lighter py-2 px-4 align-items-center text-white rounded">
              <div
                className="col-auto mr-2 square-40 bg-image rounded-circle"
                style={{ backgroundImage: `url(${PublicUsers[1].photo})` }}
              ></div>
              <div className="col-auto mr-3 d-none d-md-block">
                {PublicUsers[1].display_name}
              </div>
              <Popover
                content={
                  <div>
                    <div className="popover-item">Edit profile</div>
                    <div className="popover-item">View profile</div>
                    <div className="popover-item">Logout</div>
                  </div>
                }
              >
                <BsChevronDown className="col-auto cursor-pointer"></BsChevronDown>
              </Popover>
            </div>
          </div>
          <MdMenu
            className="text-white col-auto d-block d-lg-none"
            fontSize="34px"
            onClick={() => setIsMenuOpened(!isMenuOpened)}
          ></MdMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
