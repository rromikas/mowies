import React from "react";
import { Emoji } from "emoji-mart";
import { nFormatter } from "../../utilities/Functions";
import { connect } from "react-redux";
import OkIcon from "../../images/OkIcon";

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
            {nFormatter(value, 1)}
          </div>
        ) : (
          ""
        )}
        <div className="col-auto">
          {emoji === "heavy_division_sign" ? (
            <div style={{ marginTop: size === "normal" ? "-2px" : "-4px" }}>
              <OkIcon
                size={size === "small" ? 14 : size === "normal" ? 16 : 28}
              ></OkIcon>
            </div>
          ) : (
            <div style={{ marginBottom: size === "normal" ? "-6px" : "-2px" }}>
              <Emoji
                emoji={emoji}
                set="facebook"
                size={size === "small" ? 14 : size === "normal" ? 16 : 28}
              />
            </div>
          )}
        </div>
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
