import React, { useState, useRef } from "react";
import store from "../../store/store";
import { connect } from "react-redux";
import history from "../../History";
import { MdSearch } from "react-icons/md";

const MobileSearchBar = ({ navbarWidth }) => {
  const [searchBarExapanded, setSearchBarExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  return (
    <div
      className="container-fluid d-block d-md-none px-0"
      style={{
        boxSizing: "border-box",
        position: "fixed",
        bottom: "0px",
        right: "0px",
        zIndex: "15",
        transition: "width 0.3s",
        width: searchBarExapanded ? `320px` : "84px",
      }}
    >
      <div className="row no-gutters justify-content-end">
        <div
          className="text-dark col-auto position-relative"
          style={{
            transition: "width 0.3s",
            borderRadius: "40px",
            height: "50px",
            width: searchBarExapanded ? "100%" : "50px",
            background: "white",
          }}
        >
          <input
            ref={inputRef}
            onBlur={() => {
              setSearchBarExpanded(false);
            }}
            onFocus={async (e) => {
              setSearchBarExpanded(true);
              e.persist();
              // await new Promise((resolve) => setTimeout(resolve, 300));
              // e.target.setSelectionRange(
              //   e.target.value.toString().length,
              //   e.target.value.toString().length
              // );
            }}
            value={query}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                inputRef.current.blur();
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
            style={{
              lineHeight: "50px",
              borderRadius: "40px",
              paddingLeft: searchBarExapanded ? "20px" : 0,
              paddingRight: searchBarExapanded ? "50px" : 0,
              transition: "padding-right 0.3s, padding-left 0.3s",
            }}
            className={"w-100 transparent-input text-dark"}
          ></input>
          <div
            style={{
              height: "50px",
              width: "50px",
              position: "absolute",
              right: 0,
              bottom: 0,
              pointerEvents: "none",
              borderRadius: "40px",
              boxShadow:
                "0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0,0,0,.12)",
            }}
            className="d-flex flex-center bg-custom-primary text-white"
          >
            <MdSearch fontSize="28px"></MdSearch>
          </div>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    navbarWidth: state.navbarSize.width,
    ...ownProps,
  };
}

export default connect(mapp)(MobileSearchBar);
