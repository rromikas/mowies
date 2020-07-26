import React from "react";
import { Emoji } from "emoji-mart";
import { nFormatter } from "../utilities/Functions";

const ReactionButton = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={`col-auto ${
        props.selected ? "btn-reaction-selected" : "btn-reaction"
      }${props.className ? ` ${props.className}` : ""}`}
      style={{ minWidth: "84px", maxWidth: "111px" }}
    >
      <div className="row no-gutters align-items-center h-100 justify-content-center">
        {props.value !== undefined && props.value !== null ? (
          <div className="col mr-2">{nFormatter(props.value, 1)}</div>
        ) : (
          ""
        )}
        <div className="col-auto">
          <div style={{ marginBottom: "-6px" }}>
            <Emoji emoji={props.emoji} set="facebook" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionButton;
