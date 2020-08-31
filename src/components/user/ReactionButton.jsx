import React from "react";
import Emoji from "./Emoji";
import { nFormatter } from "../../utilities/Functions";
import { connect } from "react-redux";

const ReactionButton = ({
  emoji,
  onClick,
  size = "normal",
  allowRate = false,
  selected,
  className,
  value,
}) => {
  return (
    <div
      onClick={async () => {
        if (allowRate) {
          if (onClick) {
            onClick();
          }
        }
      }}
      className={`col-auto btn-reaction-${size} ${
        allowRate ? "btn-reaction" : ""
      }${selected ? " btn-reaction-selected" : ""}${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="row no-gutters align-items-center h-100 justify-content-center">
        {value !== undefined && value !== null ? (
          <div className={`col mr-${size !== "small" ? "2" : "1"}`}>
            {nFormatter(value.length, 1)}
          </div>
        ) : (
          ""
        )}
        <Emoji size={size} emoji={emoji}></Emoji>
      </div>
    </div>
  );
};

function mapp(state, ownProps) {
  return {
    user: state.user,
    ratings: state.ratings,
    ...ownProps,
  };
}

export default connect(mapp)(ReactionButton);
