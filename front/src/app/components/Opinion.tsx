import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import { Delete } from '@mui/icons-material';

interface OpinionProps {
  text: string
  stars: number
  user: number
  name: string
  surname: string
  product: number
  deletable: boolean
  onDelete: () => any
}

export default function Opinion({ text, stars, name, surname, deletable, onDelete }: OpinionProps) {
  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Opinion by {name} {surname}</Typography>
        <Typography variant="body1">{text}</Typography>
        <Rating name="read-only-rating" value={stars} readOnly />
        {deletable ? <Delete onClick={() => onDelete?.()} /> : <></>}
      </Box>
    </Paper>
  );
};
