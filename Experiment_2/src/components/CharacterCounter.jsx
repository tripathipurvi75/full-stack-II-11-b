import { Box, Typography } from '@mui/material';

// show live character count and limit feedback.
function CharacterCounter({ length, limit }) {
  const isExceeded = length > limit;

  return (
    <Box sx={{ mt: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="body2"
          sx={{ color: isExceeded ? '#d32f2f' : '#6b6b6b', fontWeight: 500 }}
        >
          Characters : {length}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: isExceeded ? '#d32f2f' : '#6b6b6b', fontWeight: 500 }}
        >
          {length} / {limit}
        </Typography>
      </Box>
      {isExceeded && (
        <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 0.5 }}>
          Character limit exceeded.
        </Typography>
      )}
    </Box>
  );
}

export default CharacterCounter;
