import React from "react";

const Loader = ({ loading, size = 50, theme = "light" }) => {
  return (
    loading && (
      <div className="w-100 h-100 d-flex flex-center">
        <div
          className={`loader-${theme}`}
          style={{ width: `${size}px`, height: `${size}px` }}
        ></div>
      </div>
    )
  );
};

export default Loader;
