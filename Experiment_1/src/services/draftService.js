const STORAGE_KEY = 'postComposerDrafts';

// Get all drafts saved in Local Storage
export function getDrafts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (error) {
    return [];
  }
}

function persistDrafts(drafts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

// Save a new draft to Local Storage
export function saveDraft(platform, content) {
  const drafts = getDrafts();

  const newDraft = {
    id: Date.now().toString(),
    platform,
    content
  };

  const updatedDrafts = [...drafts, newDraft];
  persistDrafts(updatedDrafts);
  return updatedDrafts;
}

// Update existing draft content by id
export function updateDraft(id, newContent) {
  const drafts = getDrafts();

  const updatedDrafts = drafts.map((draft) =>
    draft.id === id ? { ...draft, content: newContent } : draft
  );

  persistDrafts(updatedDrafts);
  return updatedDrafts;
}

// Delete a draft from Local Storage
export function deleteDraft(id) {
  const drafts = getDrafts();
  const updatedDrafts = drafts.filter((draft) => draft.id !== id);
  persistDrafts(updatedDrafts);
  return updatedDrafts;
}
