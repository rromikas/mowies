import React, { useEffect } from "react";
import { BsChevronRight, BsChevronLeft } from "react-icons/bs";

const Pagination = ({
  count,
  current,
  setCurrent,
  classNames = { selected: "input-light-selected", notSelected: "input-light" },
}) => {
  let first =
    current === count ? current - 2 : current - 1 >= 1 ? current - 1 : current;
  let second = first + 1;
  let third = second + 1;

  useEffect(() => {
    if (count === 1) {
      setCurrent(1);
    }
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

  return count > 1 ? (
    <React.Fragment>
      <div className="row no-gutters d-flex d-lg-none user-select-none">
        <div
          className={`col-auto ${classNames["notSelected"]} px-3 mr-1 cursor-pointer`}
          onClick={() => setCurrent(current - 1 >= 1 ? current - 1 : current)}
        >
          <BsChevronLeft fontSize="16px"></BsChevronLeft>
        </div>
        <div
          className={`${classNames["selected"]} col-auto text-center mr-1`}
          style={{ width: "50px" }}
        >
          {current}
        </div>
        <div
          className={`col-auto ${classNames["notSelected"]} px-3 cursor-pointer`}
          onClick={() =>
            setCurrent(current + 1 <= count ? current + 1 : current)
          }
        >
          <BsChevronRight fontSize="16px"></BsChevronRight>
        </div>
      </div>
      <div className="row no-gutters user-select-none d-none d-lg-flex">
        <div
          className={`col-auto ${classNames["notSelected"]} px-3 mr-1 cursor-pointer`}
          onClick={() => setCurrent(current - 1 >= 1 ? current - 1 : current)}
        >
          Previous
        </div>
        {first - 1 >= 1 && (
          <div
            className={`col-auto ${classNames["notSelected"]} text-center mr-1 cursor-pointer`}
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
              current === first
                ? classNames["selected"]
                : classNames["notSelected"]
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
              current === second
                ? classNames["selected"]
                : classNames["notSelected"]
            } text-center mr-1 cursor-pointer`}
            onClick={() => setCurrent(second)}
          >
            {second}
          </div>
        )}
        {third <= count && third >= 1 && (
          <div
            className={`px-0 col-auto ${
              current === third
                ? classNames["selected"]
                : classNames["notSelected"]
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
            className={`col-auto ${classNames["notSelected"]} text-center mr-1 cursor-pointer`}
            style={{ width: "50px" }}
          >
            ...
          </div>
        )}
        <div
          className={`col-auto ${classNames["notSelected"]} px-3 cursor-pointer`}
          onClick={() =>
            setCurrent(current + 1 <= count ? current + 1 : current)
          }
        >
          Next
        </div>
      </div>
    </React.Fragment>
  ) : (
    ""
  );
};

export default Pagination;
