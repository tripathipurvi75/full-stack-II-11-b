import { createSelector } from '@reduxjs/toolkit';
import { PLATFORM_LIMITS } from './postsSlice';

// Base selectors - direct slices of state.
export const selectPosts = (state) => state.posts.posts;
export const selectPlatform = (state) => state.posts.selectedPlatform;

// Derived, memoized selector: character limit for the currently selected platform.
export const selectCharacterLimit = createSelector(
  [selectPlatform],
  (platform) => PLATFORM_LIMITS[platform] ?? 0
);

// Derived, memoized selector: characters remaining given the current draft text.
// Accepts the composer's live text as a second argument via a selector factory pattern.
export const selectRemainingCharacters = createSelector(
  [selectCharacterLimit, (state, text) => text],
  (limit, text) => limit - (text ? text.length : 0)
);
