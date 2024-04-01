import React from 'react';
import Typography from '@mui/material/Typography';

export const TextEllipsis = ({ text, componentWidth, variant, fontSize, allowedRows, fontWeight }) => {
  const numRows = Math.floor(componentWidth / 16); // Assuming 16px line height
  if (!allowedRows){allowedRows = 2}


  return (
    <div
    style={{
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: numRows > allowedRows ? allowedRows : numRows, 
      maxHeight: `${numRows * 16}px`,
    }}
    >
      <Typography variant={variant} fontSize={fontSize} fontWeight={fontWeight}>
        {text}
      </Typography>
    </div>
  );
};

