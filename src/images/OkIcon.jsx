import * as React from "react";

function OkIcon(props) {
  let size = props.size ? props.size : 16;
  return (
    <svg
      id="prefix__svg8"
      viewBox="0 0 4.233 4.233"
      height={size}
      width={size}
      {...props}
    >
      <defs id="prefix__defs2">
        <style id="style899">
          {
            ".prefix__b{font-size:6px;font-family:OpenSans-Semibold,Open Sans;font-weight:600}"
          }
        </style>
      </defs>
      <g transform="translate(-20.26 -2.608)" id="prefix__layer1">
        <g transform="matrix(.26458 0 0 .26458 20.26 2.608)" id="prefix__g928">
          <rect
            y={0}
            x={0}
            width={16}
            height={16}
            rx={8}
            id="prefix__rect903"
            fill="#fff"
          />
          <text
            className="prefix__b"
            transform="translate(5 6)"
            id="prefix__text907"
          >
            <tspan x={0} y={0} id="prefix__tspan905">
              {"50"}
            </tspan>
          </text>
          <text
            className="prefix__b"
            transform="translate(5 14)"
            id="prefix__text911"
          >
            <tspan x={0} y={0} id="prefix__tspan909">
              {"50"}
            </tspan>
          </text>
          <path
            d="M6374.557 553h9"
            transform="translate(-6370.950 -545)"
            id="prefix__path913"
            fill="none"
            stroke="#000"
          />
        </g>
      </g>
    </svg>
  );
}

export default OkIcon;
