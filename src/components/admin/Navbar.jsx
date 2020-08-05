import React, { useEffect, useState, useRef } from "react";
import { MdMenu } from "react-icons/md";
import { BsSearch, BsChevronDown } from "react-icons/bs";
import Notifications from "../../images/Notifications";
import Popover from "../utility/Popover";
import Logo from "../../images/Logo";
import { connect } from "react-redux";
import history from "../../History";
import store from "../../store/store";
import { GetUserNotifications } from "../../server/DatabaseApi";

const Navbar = ({ setIsMenuOpened, isMenuOpened, user }) => {
  const lastScroll = useRef(100);
  const [direction, setDirection] = useState("up");
  const [notifications, setNotifications] = useState([]);

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

  useEffect(() => {
    async function getData() {
      if (user.notifications && user.notifications.length) {
        let data = await GetUserNotifications(user.notifications);
        if (!data.error) {
          setNotifications(data);
        }
      }
    }
    getData();
  }, [user]);

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
            className="col-auto text-center text-white h3 pl-5"
            style={{ width: "350px" }}
          >
            <div
              className="row no-gutters align-items-center cursor-pointer"
              onClick={() => history.push("/")}
            >
              <div className="square-50 mr-2">
                <Logo></Logo>
              </div>
              <div className="logo text-title-lg text-white d-none d-sm-block">
                CozyPotato
              </div>
            </div>
          </div>
          {/* <div className="col px-3 d-sm-block d-none">
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
          </div> */}
        </div>
      </div>

      <div className="col-auto">
        <div className="row no-gutters align-items-center">
          <div className="col-auto mr-3">
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
                          i !== notifications.length - 1 ? " border-bottom" : ""
                        }`}
                      >
                        <div className="col-60 text-left mb-1 font-weight-bold">
                          {x.subject}
                        </div>
                        <div className="col-60 text-left">{x.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              >
                <div
                  className="col-auto"
                  onClick={() =>
                    setNotifications((prev) =>
                      prev.map((x) => Object.assign({}, x, { seen: true }))
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
          {user.display_name ? (
            <div className="col-auto mr-3">
              <div className="row no-gutters">
                <Popover
                  content={(w) => (
                    <div style={{ width: `${w}px` }}>
                      <div className="popover-item">Edit profile</div>
                      <div className="popover-item">View profile</div>
                      <div
                        className="popover-item"
                        onClick={() => {
                          localStorage.setItem("movies_user_token", "");
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
                  <div className="col-60 bg-dark-lighter py-2 px-4 align-items-center text-white rounded">
                    <div className="row no-gutters align-items-center cursor-pointer">
                      <div
                        className="col-auto mr-2 square-40 bg-image rounded-circle"
                        style={{ backgroundImage: `url(${user.photo})` }}
                      ></div>
                      <div className="col-auto mr-3 d-none d-md-block">
                        {user.display_name}
                      </div>
                      <BsChevronDown className="col-auto"></BsChevronDown>
                    </div>
                  </div>
                </Popover>
              </div>
            </div>
          ) : (
            ""
          )}

          <MdMenu
            className="text-white col-auto d-block d-lg-none cursor-pointer"
            fontSize="34px"
            onClick={() => setIsMenuOpened(!isMenuOpened)}
          ></MdMenu>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapp)(Navbar);
