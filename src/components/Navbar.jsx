import React, { useState } from "react";
import { connect } from "react-redux";
import Popover from "./utility/Popover";
import Select from "./utility/Select";
import { BsChevronDown, BsSearch } from "react-icons/bs";
import history from "../History";
import store from "../store/store";

const Navbar = (props) => {
  const user = props.user;
  const search = props.search;
  const [query, setQuery] = useState("");
  const categories = ["Movies", "Series", "Reviews"];

  return (
    <div className="row no-gutters py-3 border-bottom align-items-center px-3 justify-content-between">
      <div className="col-auto pr-5 text-white pl-3">Website Logo</div>
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
            className="col-auto input-prepend-select"
            btnName={search.category}
          ></Select>
          <div className="col position-relative">
            <input
              value={query}
              onKeyUp={(e) => {
                if (e.keyCode === 13) {
                  store.dispatch({ type: "UPDATE_SEARCH", search: { query } });
                  history.push("/search");
                }
              }}
              onChange={(e) => {
                e.persist();
                setQuery(e.target.value);
              }}
              type="text"
              spellCheck={false}
              className="w-100 input"
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
        <div className="row no-gutters align-items-center">
          <div
            className="col-auto mr-2 rounded-circle square-40 bg-image"
            style={{
              backgroundImage: `url(${user.photo})`,
              border: "1px solid white",
            }}
          ></div>
          <div className="col-auto mr-2 d-none d-sm-block">{user.name}</div>
          <Popover
            content={
              <div>
                <div className="popover-item border-bottom">My wishlist</div>
                <div className="popover-item border-bottom">My reviews</div>
                <div className="popover-item">Logout</div>
              </div>
            }
          >
            <div className="col-auto user-select-none cursor-pointer">
              <BsChevronDown fontSize="14px"></BsChevronDown>
            </div>
          </Popover>
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
