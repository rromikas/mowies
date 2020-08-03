import React, { useState, useRef } from "react";
import Popover from "./Popover";
import { BsChevronDown } from "react-icons/bs";
import { MdArrowDropDown } from "react-icons/md";
import uniqid from "uniqid";

const Select = ({
  items,
  btnName,
  className = "",
  multipleSelect = false,
  popoverClass = "",
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
      content={
        <div
          className="bg-white"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {items.map((x, i) => (
            <div
              key={uniqid()}
              className="popover-item"
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
      }
    >
      <div
        ref={opener}
        className={
          "cursor-pointer user-select-none d-flex justify-content-between align-items-center " +
          className
        }
      >
        <div className="mr-2">{btnName}</div>
        <MdArrowDropDown
          fontSize="16px"
          strokeWidth="1.5px"
          className="text-internly"
          style={{
            transform: `rotate(${isOpen ? "180deg" : "0deg"})`,
            transition: "transform 0.3s",
          }}
        ></MdArrowDropDown>
      </div>
    </Popover>
  );
};

export default Select;
