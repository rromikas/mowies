import React from "react";
import OkIcon from "../../images/OkIcon";

export default ({ emoji, size = "normal" }) => {
  emoji = emoji === "shit" ? "pile-of-poo" : emoji;
  let sizeClass =
    size === "small"
      ? ""
      : size === "normal"
      ? "twa-lg"
      : size === "big"
      ? "twa-2x"
      : "";
  return emoji.toString() === "heavy_division_sign" ? (
    <OkIcon size={size === "small" ? 14 : size === "normal" ? 18 : 28}></OkIcon>
  ) : (
    <i className={`twa ${sizeClass} twa-${emoji}`}></i>
  );
};
