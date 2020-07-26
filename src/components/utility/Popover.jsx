import React, { useEffect, useState } from "react";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";

const Popover = ({
  className,
  onOpen = () => {},
  position = "bottom",
  arrow = true,
  theme = "light",
  content,
  trigger = "click",
  delay = 0,
  animation = "scale",
  open = undefined,
  onHide = () => {},
  ...rest
}) => {
  useEffect(() => {
    return function cleanUp() {
      let popovers = document.getElementsByClassName("tippy-popper");
      for (let i = 0; i < popovers.length; i++) {
        popovers[i].parentNode.removeChild(popovers[i]);
      }
    };
  }, []);
  const [wasShowed, setWasShowed] = useState(false);
  return (
    <Tooltip
      onShow={() => {
        if (!wasShowed) {
          setWasShowed(true);
          onOpen();
        }
      }}
      onHide={onHide}
      delay={delay}
      hideDelay={0}
      html={content}
      position={position}
      trigger={trigger}
      theme={theme}
      arrow={arrow}
      interactive={true}
      animation={animation}
      open={open}
      unmountHTMLWhenHide={true}
      className={className}
    >
      {rest.children}
    </Tooltip>
  );
};

export default Popover;
