import React, { useEffect, useState, useRef } from "react";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";

const Popover = ({
  className,
  onOpen = () => {},
  position = "bottom",
  arrow = true,
  theme = "light",
  content = () => {},
  trigger = "click",
  delay = 0,
  animation = "scale",
  open = undefined,
  onHide = () => {},
  popoverWidth = "auto",
  ...rest
}) => {
  const [contentWidth, setContentWidth] = useState(0);

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
      html={content(contentWidth)}
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
      {React.cloneElement(
        rest.children,
        Object.assign({}, rest.children.props, {
          ref: (el) => {
            if (el) {
              if (contentWidth === 0) {
                setContentWidth(el.getBoundingClientRect().width);
              }
              if (rest.children) {
                const { ref } = rest.children;
                if (ref && "current" in ref) {
                  ref.current = el;
                }
                if (typeof ref === "function") {
                  ref(el);
                }
              }
            }
          },
        })
      )}
    </Tooltip>
  );
};

export default Popover;
