import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import useValidation from '../hooks/useValidation';

const PostComposer = ({ platform, content, onChange, onSaveDraft }) => {
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Custom hook calculates character count / limit / exceeded status
  const { charCount, maxCharacters, isExceeded } = useValidation(platform, content);

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  // Copy button: copy textarea content to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    showSnackbar('Post copied successfully');
  };

  // Validate platform / content / limit, then save draft
  const handleSaveDraft = () => {
    if (!platform) {
      showSnackbar('Please select a platform');
      return;
    }
    if (content.trim() === '') {
      showSnackbar('Post content cannot be empty');
      return;
    }
    if (isExceeded) {
      showSnackbar('Character limit exceeded');
      return;
    }

    onSaveDraft();
    showSnackbar('Draft saved successfully');
  };

  return (
    <section className="post-composer">
      <div className="post-composer-heading">
        <h2>Write Your Post Here</h2>
      </div>

      <textarea
        className="post-composer-textarea"
        placeholder="Write your post here..."
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
      />

      {isExceeded && <p className="error-text">Character limit exceeded</p>}

      <div className="character-info">
        <p className={isExceeded ? 'error-text' : ''}>Characters : {charCount}</p>
        <p className={isExceeded ? 'error-text' : ''}>
          {charCount} / {maxCharacters}
        </p>
      </div>

      <div className="button-group">
        <Button variant="outlined" onClick={() => onChange('')}>
          Clear
        </Button>
        <Button variant="outlined" onClick={handleCopy}>
          Copy
        </Button>
        <Button variant="contained" onClick={handleSaveDraft} disabled={isExceeded}>
          Save Draft
        </Button>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </section>
  );
};

export default PostComposer;
