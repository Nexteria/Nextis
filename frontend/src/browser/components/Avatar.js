import React from 'react';

export default function avatar(data) {
  const { color, size } = data;

  const width = size || 30;
  const height = size || 30;
  const ratio = width / 30;

  return (
    <i
      className={`img-circle text-center fa fa-user bg-${color || 'blue'}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        fontSize: `${ratio * 14}px`,
        float: 'left',
        lineHeight: `${ratio * 30}px`,
      }}
    >
    </i>
  );
}
