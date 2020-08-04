import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import Popover from "../utility/Popover";
import Select from "../utility/Select";
import { BsChevronDown, BsSearch } from "react-icons/bs";
import history from "../../History";
import store from "../../store/store";
import Logo from "../../images/Logo";
import Announcement from "./Announcement";

const Navbar = (props) => {
  const user = props.user;
  const search = props.search;
  const [query, setQuery] = useState("");
  const categories = ["All", "Movies", "Series", "Reviews"];
  const [scrolledToTop, setScrolledTopTop] = useState(true);
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

  return (
    <div
      className="col-60"
      style={{
        position: "fixed",
        zIndex: 59,
        transition: "top 0.5s",
        top: direction === "up" ? "0px" : "-200px",
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
        <div className="col-60 content-container">
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
            <div className="col pr-5 d-none d-md-block">
              <div className="row no-gutters align-items-center">
                <Select
                  items={categories}
                  onSelect={(index) =>
                    store.dispatch({
                      type: "UPDATE_SEARCH",
                      search: { category: categories[index] },
                    })
                  }
                  popoverWidth={"150px"}
                  className="col-auto input-prepend-select"
                  btnName={search.category}
                ></Select>
                <div className="col position-relative">
                  <input
                    value={query}
                    onKeyUp={(e) => {
                      if (e.keyCode === 13) {
                        store.dispatch({
                          type: "UPDATE_SEARCH",
                          search: { query },
                        });
                        history.push("/search");
                      }
                    }}
                    onChange={(e) => {
                      e.persist();
                      setQuery(e.target.value);
                    }}
                    type="text"
                    spellCheck={false}
                    className={`w-100 input`}
                  ></input>
                  <BsSearch
                    onClick={() => history.push("/search")}
                    fontSize="24px"
                    className="position-absolute text-white cursor-pointer"
                    style={{ top: 0, bottom: 0, right: "20px", margin: "auto" }}
                  ></BsSearch>
                </div>
              </div>
            </div>
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
                            history.push(`/profile/${user._id}`);
                          }}
                        >
                          My profile
                        </div>
                        <div
                          className="popover-item"
                          onClick={() => {
                            localStorage["movies_user_token"] = "";
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
                    <div className="col-60">
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
          </div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    search: state.search,
    ...ownProps,
  };
}

export default connect(mapp)(Navbar);
