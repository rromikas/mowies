import React, { useState, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import store from "../../store/store";
import { connect } from "react-redux";
import history from "../../History";

const MobileSearchBar = () => {
  const [searchBarExapanded, setSearchBarExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  return (
    <div
      className="row no-gutters justify-content-end px-2 py-3 d-flex d-md-none"
      style={{
        position: "fixed",
        bottom: "0px",
        right: "0px",
        zIndex: "15",
        transition: "width 0.3s",
        width: searchBarExapanded ? "100%" : "56px",
      }}
    >
      <div
        className="text-white d-flex justify-content-end col-auto position-relative"
        style={{
          transition: "width 0.3s",
          borderRadius: "40px",
          height: "40px",
          width: "100%",
          background: "#585858",
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
            await new Promise((resolve) => setTimeout(resolve, 300));
            e.target.setSelectionRange(
              e.target.value.toString().length,
              e.target.value.toString().length
            );
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
            borderRadius: "40px",
            paddingLeft: searchBarExapanded ? "20px" : 0,
            paddingRight: searchBarExapanded ? "40px" : 0,
            transition: "padding-right 0.3s, padding-left 0.3s",
          }}
          className={"w-100 transparent-input text-white"}
        ></input>
        <div
          style={{
            height: "40px",
            width: "40px",
            position: "absolute",
            right: 0,
            bottom: 0,
            pointerEvents: "none",
            borderRadius: "40px",
            background: "#585858",
          }}
          className="d-flex flex-center"
        >
          <BsSearch></BsSearch>
        </div>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    search: state.search,
    settings: state.settings,
    ...ownProps,
  };
}

export default connect(mapp)(MobileSearchBar);
