import React from 'react';
import DraftCard from './DraftCard';

function DraftManager({ drafts, onUpdateDraft, onDeleteDraft }) {
  return (
    <section className="draft-manager">
      <h2 className="section-heading">Saved Drafts</h2>

      {drafts.length === 0 && <p className="empty-text">No drafts saved yet.</p>}

      {drafts.map((draft) => (
        <DraftCard
          key={draft.id}
          draft={draft}
          onUpdate={onUpdateDraft}
          onDelete={onDeleteDraft}
        />
      ))}
    </section>
  );
}

export default DraftManager;
