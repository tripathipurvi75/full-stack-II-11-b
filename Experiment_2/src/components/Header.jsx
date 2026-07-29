import { Box, Typography } from '@mui/material';

// Single responsibility: display the app title and subtitle, centered.
function Header() {
  return (
    <Box sx={{ textAlign: 'center', mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
        Multiple Platform Post Composer
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#6b6b6b', mt: 1 }}>
        Create content optimized for every platform.
      </Typography>
    </Box>
  );
}

export default Header;
