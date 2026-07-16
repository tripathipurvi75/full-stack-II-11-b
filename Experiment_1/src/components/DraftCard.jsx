import React, { useState } from 'react';
import Button from '@mui/material/Button';

// Displays a single saved draft with Edit / Save / Delete actions
function DraftCard({ draft, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(draft.content);

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    onUpdate(draft.id, content);
    setIsEditing(false);
  };

  const handleDelete = () => onDelete(draft.id);

  const handleContentChange = (event) => setContent(event.target.value);

  return (
    <div className="draft-card">
      <p className="draft-platform">{draft.platform}</p>

      <textarea
        className="draft-textarea"
        value={content}
        disabled={!isEditing}
        onChange={handleContentChange}
      />

      <div className="button-group">
        <Button variant="outlined" size="small" onClick={handleEdit} disabled={isEditing}>
          Edit
        </Button>
        <Button variant="outlined" size="small" onClick={handleSave} disabled={!isEditing}>
          Save
        </Button>
        <Button variant="outlined" color="error" size="small" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}

export default DraftCard;
