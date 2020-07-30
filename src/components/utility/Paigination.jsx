import React from "react";

const Pagination = ({ count, current, setCurrent }) => {
  let first =
    current === count ? current - 2 : current - 1 >= 1 ? current - 1 : current;
  let second = first + 1;
  let third = second + 1;
  console.log("frs send thirs", first, second, third);
  return (
    <React.Fragment>
      <div className="row no-gutters d-flex d-lg-none user-select-none">
        <div
          className="col-auto input-light px-3 mr-1 cursor-pointer"
          onClick={() => setCurrent(current - 1 >= 1 ? current - 1 : current)}
        >
          {`<`}
        </div>
        <div
          className="input-light-selected col-auto text-center mr-1"
          style={{ width: "50px" }}
        >
          {current}
        </div>
        <div
          className="col-auto input-light px-3 cursor-pointer"
          onClick={() =>
            setCurrent(current + 1 <= count ? current + 1 : current)
          }
        >
          {`>`}
        </div>
      </div>
      <div className="row no-gutters user-select-none d-none d-lg-flex">
        <div
          className="col-auto input-light px-3 mr-1 cursor-pointer"
          onClick={() => setCurrent(current - 1 >= 1 ? current - 1 : current)}
        >
          Previous
        </div>
        {first - 1 >= 1 && (
          <div
            className="col-auto input-light text-center mr-1 cursor-pointer"
            style={{ width: "50px" }}
            onClick={() => setCurrent(first - 1 >= 1 ? first - 1 : first)}
          >
            ...
          </div>
        )}
        {first >= 1 && (
          <div
            style={{ width: "50px" }}
            className={`px-0 col-auto ${
              current === first ? "input-light-selected" : "input-light"
            } text-center mr-1 cursor-pointer`}
            onClick={() => setCurrent(first)}
          >
            {first}
          </div>
        )}

        {second <= count && second >= 1 && (
          <div
            style={{ width: "50px" }}
            className={`px-0 col-auto ${
              current === second ? "input-light-selected" : "input-light"
            } text-center mr-1 cursor-pointer`}
            onClick={() => setCurrent(second)}
          >
            {second}
          </div>
        )}
        {third <= count && third >= 1 && (
          <div
            className={`px-0 col-auto ${
              current === third ? "input-light-selected" : "input-light"
            } text-center mr-1 cursor-pointer`}
            style={{ width: "50px" }}
            onClick={() => setCurrent(third)}
          >
            {third}
          </div>
        )}

        {third + 1 <= count && (
          <div
            onClick={() => setCurrent(third + 1 <= count ? third + 1 : current)}
            className="col-auto input-light text-center mr-1 cursor-pointer"
            style={{ width: "50px" }}
          >
            ...
          </div>
        )}
        <div
          className="col-auto input-light px-3 cursor-pointer"
          onClick={() =>
            setCurrent(current + 1 <= count ? current + 1 : current)
          }
        >
          Next
        </div>
      </div>
    </React.Fragment>
  );
};

export default Pagination;
