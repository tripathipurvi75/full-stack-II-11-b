import { useState } from 'react';
import { Paper, Typography, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, clearComposer } from '../redux/postsSlice';
import { selectPlatform, selectCharacterLimit } from '../redux/selectors';
import PlatformSelector from './PlatformSelector';
import CharacterCounter from './CharacterCounter';
import ButtonGroup from './ButtonGroup';

// Single responsibility: compose a new post and save it as a draft to Redux.
function PostComposer() {
  const dispatch = useDispatch();
  const platform = useSelector(selectPlatform);
  const limit = useSelector(selectCharacterLimit);

  const [content, setContent] = useState('');

  const isExceeded = content.length > limit;
  const isEmpty = content.trim().length === 0;

  const handleClear = () => {
    setContent('');
    dispatch(clearComposer());
  };

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
    }
  };

  const handleSaveDraft = () => {
    if (isExceeded || isEmpty) return;
    dispatch(addPost({ platform, content }));
    setContent('');
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '12px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        mb: 3,
      }}
    >
      <PlatformSelector />

      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: '#333' }}>
        Write Your Post
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={4}
        maxRows={12}
        placeholder="Write your post here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': { borderRadius: '10px' },
        }}
      />

      <CharacterCounter length={content.length} limit={limit} />

      <ButtonGroup
        onClear={handleClear}
        onCopy={handleCopy}
        onSaveDraft={handleSaveDraft}
        saveDisabled={isExceeded || isEmpty}
      />
    </Paper>
  );
}

export default PostComposer;
