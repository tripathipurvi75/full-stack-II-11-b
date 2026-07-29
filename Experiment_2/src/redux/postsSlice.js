import { createSlice, nanoid } from '@reduxjs/toolkit';

// Character limits per platform - single source of truth for validation logic.
export const PLATFORM_LIMITS = {
  Twitter: 280,
  Instagram: 2200,
  LinkedIn: 3000,
  Facebook: 63206,
};

const initialState = {
  posts: [], // array of { id, platform, content, createdAt }
  loading: false,
  error: null,
  selectedPlatform: 'Twitter',
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Adds a new saved draft to the store (Create).
    addPost: {
      reducer(state, action) {
        state.posts.unshift(action.payload);
      },
      prepare(post) {
        return {
          payload: {
            id: nanoid(),
            createdAt: new Date().toISOString(),
            ...post,
          },
        };
      },
    },

    // Updates an existing draft's content (Update).
    updatePost(state, action) {
      const { id, content } = action.payload;
      const existingPost = state.posts.find((post) => post.id === id);
      if (existingPost) {
        existingPost.content = content;
      }
    },

    // Removes a draft from the store (Delete).
    deletePost(state, action) {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },

    // Resets the composer's currently selected platform back to default.
    clearComposer(state) {
      state.selectedPlatform = 'Twitter';
    },

    // Updates which platform is currently selected in the composer.
    setPlatform(state, action) {
      state.selectedPlatform = action.payload;
    },
  },
});

export const { addPost, updatePost, deletePost, clearComposer, setPlatform } =
  postsSlice.actions;

export default postsSlice.reducer;
