import * as React from "react";

function RemoveIcon(props) {
  let size = props.size ? props.size : 20;
  return (
    <svg viewBox="0 0 4.928 2.882" height={size} width={size} {...props}>
      <g
        transform="translate(-19.41 -12.996)"
        fillOpacity={0.988}
        paintOrder="markers fill stroke"
      >
        <rect
          rx={0}
          y={12.996}
          x={19.41}
          height={0.6}
          width={3.449}
          ry={0.084}
        />
        <rect
          width={3.449}
          height={0.6}
          x={19.415}
          y={14.098}
          rx={0}
          ry={0.077}
        />
        <rect
          width={2.238}
          height={0.551}
          x={19.423}
          y={15.226}
          rx={0}
          ry={0.071}
        />
        <rect
          rx={0}
          y={15.226}
          x={22.1}
          height={0.551}
          width={2.238}
          ry={0.077}
        />
      </g>
    </svg>
  );
}

export default RemoveIcon;
