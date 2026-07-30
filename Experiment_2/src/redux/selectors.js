import { createSelector } from '@reduxjs/toolkit';
import { PLATFORM_LIMITS } from './postsSlice';


export const selectPosts = (state) => state.posts.posts;
export const selectPlatform = (state) => state.posts.selectedPlatform;

//  character limit for the currently selected platform.
export const selectCharacterLimit = createSelector(
  [selectPlatform],
  (platform) => PLATFORM_LIMITS[platform] ?? 0
);


export const selectRemainingCharacters = createSelector(
  [selectCharacterLimit, (state, text) => text],
  (limit, text) => limit - (text ? text.length : 0)
);
