import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import SocialMediaSelect from './components/platformDropDown';
import PostComposer from './components/PostComposer';
import DraftManager from './components/DraftManager';
import Footer from './components/Footer';
import { getDrafts, saveDraft, updateDraft, deleteDraft } from './services/draftService';

function App() {
  const [platform, setPlatform] = useState('');
  const [content, setContent] = useState('');
  const [drafts, setDrafts] = useState([]);

  // Load drafts automatically on page refresh
  useEffect(() => {
    setDrafts(getDrafts());
  }, []);

  // Save draft to local storage
  const handleSaveDraft = () => {
    const updatedDrafts = saveDraft(platform, content);
    setDrafts(updatedDrafts);
    setContent('');
  };

  // Update existing draft
  const handleUpdateDraft = (id, newContent) => {
    const updatedDrafts = updateDraft(id, newContent);
    setDrafts(updatedDrafts);
  };

  // Delete a draft
  const handleDeleteDraft = (id) => {
    const updatedDrafts = deleteDraft(id);
    setDrafts(updatedDrafts);
  };

  return (
    <div className="app-container">
      <Header />

      <div className="card">
        <SocialMediaSelect value={platform} onChange={setPlatform} />

        <PostComposer
          platform={platform}
          content={content}
          onChange={setContent}
          onSaveDraft={handleSaveDraft}
        />
      </div>

      <div className="card">
        <DraftManager
          drafts={drafts}
          onUpdateDraft={handleUpdateDraft}
          onDeleteDraft={handleDeleteDraft}
        />
      </div>

      <Footer />
    </div>
  );
}

export default App;
