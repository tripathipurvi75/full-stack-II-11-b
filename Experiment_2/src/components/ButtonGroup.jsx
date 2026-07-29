import { Stack, Button } from '@mui/material';

// Single responsibility: render the Clear / Copy / Save Draft action row.
function ButtonGroup({ onClear, onCopy, onSaveDraft, saveDisabled }) {
  return (
    <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
      <Button
        variant="outlined"
        onClick={onClear}
        fullWidth
        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
      >
        Clear
      </Button>
      <Button
        variant="outlined"
        onClick={onCopy}
        fullWidth
        sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
      >
        Copy
      </Button>
      <Button
        variant="contained"
        onClick={onSaveDraft}
        disabled={saveDisabled}
        fullWidth
        sx={{
          borderRadius: '10px',
          textTransform: 'none',
          fontWeight: 600,
          bgcolor: '#1976d2',
          '&:hover': { bgcolor: '#1565c0' },
        }}
      >
        Save Draft
      </Button>
    </Stack>
  );
}

export default ButtonGroup;
