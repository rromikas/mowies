import React from "react";
import ReactLoading from "react-loading";

const Loader = ({ loading, size = 50 }) => {
  return (
    loading && (
      <div className="w-100 h-100 d-flex flex-center">
        <div
          className="loader"
          style={{ width: `${size}px`, height: `${size}px` }}
        ></div>
      </div>
    )
  );
};

export default Loader;
