import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Popover from "../utility/Popover";
import Select from "../utility/Select";
import { BsChevronDown, BsSearch } from "react-icons/bs";
import history from "../../History";
import store from "../../store/store";
import Logo from "../../images/Logo";
import Announcement from "./Announcement";
import { GetUserNotifications } from "../../server/DatabaseApi";
import Notifications from "../../images/Notifications";
import { withResizeDetector } from "react-resize-detector";
import { useLocation } from "react-router-dom";
import SearchBox from "./SearchBox";
import { MdMenu } from "react-icons/md";

const Navbar = (props) => {
  const user = props.user;
  const dashboardMenuOpened = props.dashboardMenuOpened;
  const height = props.height;

  const [scrolledToTop, setScrolledTopTop] = useState(true);
  const lastScroll = useRef(100);
  const [direction, setDirection] = useState("up");
  const [notifications, setNotifications] = useState([]);
  const profilePopover = useRef(null);

  const location = useLocation();

  useEffect(() => {
    function handleScrolling() {
      let scrollY = window.scrollY;
      if (lastScroll.current < scrollY) {
        setDirection("down");
      } else {
        setDirection("up");
      }
      lastScroll.current = scrollY;
      if (scrollY === 0) {
        setScrolledTopTop(true);
      } else {
        setScrolledTopTop(false);
      }
    }
    window.addEventListener("scroll", handleScrolling);

    return () => {
      window.removeEventListener("scroll", handleScrolling);
    };
  }, []);

  useEffect(() => {
    async function getData() {
      if (user.notifications && user.notifications.length) {
        let data = await GetUserNotifications(user.notifications);
        if (!data.error) {
          setNotifications(
            data.map((x) => Object.assign({}, x, { seen: false }))
          );
        }
      }
    }
    getData();
  }, [user]);

  useEffect(() => {
    if (height) {
      store.dispatch({ type: "SET_HEIGHT", height });
    }
  }, [height]);

  return location.pathname !== "/login" && location.pathname !== "/signup" ? (
    <div
      className="col-60 px-0"
      style={{
        position: "sticky",
        zIndex: 59,
        transition: "top 0.5s",
        top: direction === "up" ? "0px" : `-${height}px`,
        left: 0,
        right: 0,
      }}
    >
      <Announcement></Announcement>
      <div
        className={`bg-transition row no-gutters justify-content-center${
          !scrolledToTop ? " bg-root" : ""
        }`}
      >
        <div
          className={`col-60${
            location.pathname !== "/admin" ? " content-container" : ""
          }`}
        >
          <div className="row no-gutters justify-content-between px-3 py-2 align-items-center flex-nowrap">
            <div className="col-auto d-none d-sm-block pr-sm-5 pr-3 text-white pl-sm-3 pl-2">
              <div
                className="row no-gutters align-items-center cursor-pointer"
                onClick={() => history.push("/")}
              >
                <div className="square-50 mr-2">
                  <Logo></Logo>
                </div>
                <div className="col-auto logo text-title-lg">CozyPotato</div>
              </div>
            </div>
            <div
              className="d-block d-sm-none cursor-pointer"
              onClick={() => history.push("/")}
            >
              <div className="square-40 mx-auto">
                <Logo></Logo>
              </div>
              <div className="col-auto logo text-title-lg text-white">
                CozyPotato
              </div>
            </div>
            <div className="col pr-3 d-none d-md-block">
              <SearchBox navbarHeight={height}></SearchBox>
            </div>
            <div className="col-auto">
              <div className="row no-gutters">
                {user.display_name ? (
                  <div className="col-auto">
                    <div className="row no-gutters">
                      <Popover
                        content={(w) => (
                          <div
                            className="container-fluid rounded"
                            style={{ maxWidth: "300px", width: "100%" }}
                          >
                            {notifications.map((x, i) => (
                              <div
                                key={`notificaiton-${i}`}
                                className={`row no-gutters p-4${
                                  i !== notifications.length - 1
                                    ? " border-bottom"
                                    : ""
                                }`}
                              >
                                <div className="col-60 text-left mb-1 font-weight-bold">
                                  {x.subject}
                                </div>
                                <div className="col-60 text-left">
                                  {x.description}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      >
                        <div
                          className="col-auto"
                          onClick={() =>
                            setNotifications((prev) =>
                              prev.map((x) =>
                                Object.assign({}, x, { seen: true })
                              )
                            )
                          }
                        >
                          <Notifications
                            count={notifications.filter((x) => !x.seen).length}
                          ></Notifications>
                        </div>
                      </Popover>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="col-auto text-white">
                  {user.display_name ? (
                    <div className="row no-gutters align-items-center">
                      <Popover
                        content={(w) => (
                          <div
                            style={{
                              borderRadius: "4px",
                              overflow: "hidden",
                              width: `${w}px`,
                            }}
                          >
                            <div
                              className="popover-item border-bottom"
                              onClick={() => {
                                profilePopover.current.click();
                                history.push(`/profile/${user._id}`);
                              }}
                            >
                              My Profile
                            </div>
                            <div
                              className="popover-item border-bottom"
                              onClick={() => {
                                profilePopover.current.click();
                                history.push(`/profile/${user._id}/2`);
                              }}
                            >
                              My Reviews
                            </div>
                            <div
                              className="popover-item border-bottom"
                              onClick={() => {
                                profilePopover.current.click();
                                history.push(`/profile/${user._id}/0`);
                              }}
                            >
                              My Wishlist
                            </div>
                            <div
                              className="popover-item"
                              onClick={() => {
                                profilePopover.current.click();
                                localStorage.removeItem("movies_user_token");
                                store.dispatch({
                                  type: "SET_USER",
                                  user: {
                                    display_name: "",
                                    photo: "",
                                    token: "",
                                    ratings: {},
                                    wishlist: [],
                                  },
                                });
                                history.push("/");
                              }}
                            >
                              Logout
                            </div>
                          </div>
                        )}
                      >
                        <div className="col-60" ref={profilePopover}>
                          <div className="row no-gutters align-items-center cursor-pointer">
                            <div
                              className="col-auto mr-2 rounded-circle square-40 bg-image"
                              style={{
                                backgroundImage: `url(${user.photo})`,
                                border: "1px solid white",
                              }}
                            ></div>
                            <div className="col-auto mr-2 d-none d-sm-block">
                              {user.display_name}
                            </div>
                            <div className="col-auto user-select-none">
                              <BsChevronDown fontSize="14px"></BsChevronDown>
                            </div>
                          </div>
                        </div>
                      </Popover>
                    </div>
                  ) : (
                    <div className="row no-gutters pr-sm-3 pr-2 align-items-center">
                      <div
                        className="col-auto cursor-pointer fb-btn"
                        onClick={() => {
                          history.push("/login");
                        }}
                      >
                        Login
                      </div>
                      <div
                        className="col-auto cursor-pointer fb-btn"
                        onClick={() => history.push("/signup")}
                      >
                        Signup
                      </div>
                    </div>
                  )}
                </div>
                {location.pathname === "/admin" ? (
                  <MdMenu
                    className="text-white col-auto d-block d-lg-none cursor-pointer"
                    fontSize="34px"
                    onClick={() =>
                      store.dispatch({
                        type: "SET_DASHBOARD_MENU_OPENED",
                        isOpened: !dashboardMenuOpened,
                      })
                    }
                  ></MdMenu>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div></div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    search: state.search,
    dashboardMenuOpened: state.dashboardMenuOpened,
    ...ownProps,
  };
}

export default withResizeDetector(connect(mapp)(Navbar));
