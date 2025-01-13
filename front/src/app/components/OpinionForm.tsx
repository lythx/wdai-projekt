import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';
import Rating from '@mui/material/Rating';
import utils from '../utils/utils';

export default function OpinionForm({ onSubmit }: { onSubmit: (rating: number, text: string) => any }) {
  const [opinion, setOpinion] = useState('');
  const [rating, setRating] = useState(0);

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Your Opinion</Typography>
        <TextField
          label="Opinion"
          variant="outlined"
          multiline
          rows={4}
          value={opinion}
          onChange={(e) => setOpinion(e.target.value)}
        />
        <Rating
          name="rating"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue ?? 1);
          }}
        />
        <Button type="submit" variant="contained" color="primary" onClick={() => onSubmit(rating, opinion)} >
          Submit
        </Button>
      </Box>
    </Paper>
  );
};