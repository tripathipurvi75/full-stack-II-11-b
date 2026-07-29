import { Box, Container } from '@mui/material';
import Header from './components/Header';
import PostComposer from './components/PostComposer';
import SavedDrafts from './components/SavedDrafts';

function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        py: 6,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="sm" disableGutters>
        <Header />
        <PostComposer />
        <SavedDrafts />
      </Container>
    </Box>
  );
}

export default App;
