import React, { useState, useRef } from "react";
import Popover from "./Popover";
import { BsChevronDown } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
import uniqid from "uniqid";

const AutoPopulate = ({
  items,
  btnName,
  className = "",
  multipleSelect = false,
  popoverClass = "",
  popoverWidth = "auto",
  onSelect = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const opener = useRef(null);
  return (
    <Popover
      className={popoverClass}
      arrow={false}
      onOpen={() => setIsOpen(true)}
      onHide={() => setIsOpen(false)}
      content={(w) => (
        <div
          className="bg-white"
          style={{ maxHeight: "400px", overflowY: "auto", width: w }}
        >
          {items.map((x, i) => (
            <div
              key={uniqid()}
              className="popover-item w-100"
              onClick={() => {
                onSelect(i);
                if (!multipleSelect) {
                  opener.current.click();
                }
              }}
            >
              <div>{x.item ? x.item : x}</div>
            </div>
          ))}
        </div>
      )}
    >
      <div
        ref={opener}
        className={
          "cursor-pointer user-select-none d-flex justify-content-between align-items-center " +
          className
        }
      >
        {btnName}
      </div>
    </Popover>
  );
};

export default AutoPopulate;
