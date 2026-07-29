import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice';

// The Redux Store acts as the single source of truth for the entire app.
export const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

export default store;
