import { useState } from 'react';
import { Box, Typography, TextField, Stack, Button, Chip } from '@mui/material';
import { useDispatch } from 'react-redux';
import { updatePost, deletePost } from '../redux/postsSlice';
import { PLATFORM_LIMITS } from '../redux/postsSlice';
import CharacterCounter from './CharacterCounter';
 //display a single saved draft and handle its own edit/save/delete/cancel flow.
function DraftCard({ post }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(post.content);

  const limit = PLATFORM_LIMITS[post.platform] ?? 0;
  const isExceeded = draftText.length > limit;

  const handleEdit = () => {
    setDraftText(post.content);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (isExceeded || draftText.trim().length === 0) return;
    dispatch(updatePost({ id: post.id, content: draftText }));
    setIsEditing(false);
  };

  const handleDelete = () => {
    dispatch(deletePost(post.id));
  };

  const handleCancel = () => {
    setDraftText(post.content);
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        p: 2.5,
        mb: 2,
        '&:last-of-type': { mb: 0 },
      }}
    >
      <Chip
        label={post.platform}
        size="small"
        sx={{ mb: 1.5, fontWeight: 600, bgcolor: '#eef3fc', color: '#1976d2' }}
      />

      {isEditing ? (
        <>
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
          <CharacterCounter length={draftText.length} limit={limit} />
        </>
      ) : (
        <Typography variant="body2" sx={{ color: '#333', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>
      )}

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        {isEditing ? (
          <>
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              disabled={isExceeded || draftText.trim().length === 0}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600, bgcolor: '#1976d2' }}
            >
              Save
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleDelete}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Delete
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleCancel}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              onClick={handleEdit}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={handleDelete}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
            >
              Delete
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
}

export default DraftCard;
