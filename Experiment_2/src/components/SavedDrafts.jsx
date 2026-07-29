import { Paper, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectPosts } from '../redux/selectors';
import DraftCard from './DraftCard';

// render the list of saved drafts, or an empty state.
function SavedDrafts() {
  const posts = useSelector(selectPosts);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1a1a1a' }}>
        Saved Drafts
      </Typography>

      {posts.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
            No drafts available.
          </Typography>
        </Box>
      ) : (
        posts.map((post) => <DraftCard key={post.id} post={post} />)
      )}
    </Paper>
  );
}

export default SavedDrafts;
