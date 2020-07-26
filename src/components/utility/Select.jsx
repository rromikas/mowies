import React, { useState, useRef } from "react";
import Popover from "./Popover";
import { BsChevronDown } from "react-icons/bs";
import uniqid from "uniqid";

const Select = ({
  items,
  btnName,
  className = "",
  multipleSelect = false,
  btnClassName = "",
  onSelect = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const opener = useRef(null);
  return (
    <Popover
      arrow={false}
      onOpen={() => setIsOpen(true)}
      onHide={() => setIsOpen(false)}
      content={
        <div className="bg-white">
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
        <BsChevronDown
          fontSize="16px"
          strokeWidth="1.5px"
          className="text-internly"
          style={{
            transform: `rotate(${isOpen ? "180deg" : "0deg"})`,
            transition: "transform 0.3s",
          }}
        ></BsChevronDown>
      </div>
    </Popover>
  );
};

export default Select;
