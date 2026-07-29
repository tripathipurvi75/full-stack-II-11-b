# Multiple Platform Post Composer — Experiment 2 (Redux Toolkit)

A single-page React app demonstrating Redux Toolkit concepts: centralized state
management, `createSlice`, CRUD reducers, and memoized selectors with
`createSelector`.

## Features

- Select a platform (Twitter, Instagram, LinkedIn, Facebook) with an
  automatically updating character limit.
- Live character counter with over-limit warning.
- Clear, Copy, and Save Draft actions.
- Saved drafts list with inline Edit / Save / Delete / Cancel.
- Empty-state messaging when no drafts exist.
- All state lives in a single Redux store — no Context API, no local
  duplication of source-of-truth data.

## Tech stack

- React 18 + Vite
- Redux Toolkit + React-Redux
- Material UI (MUI)

## Getting started

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically http://localhost:5173).

To create a production build:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    Header.jsx
    PlatformSelector.jsx
    PostComposer.jsx
    CharacterCounter.jsx
    ButtonGroup.jsx
    SavedDrafts.jsx
    DraftCard.jsx
  redux/
    store.js
    postsSlice.js
    selectors.js
  App.jsx
  main.jsx
```

## Redux Toolkit concepts demonstrated

- **Single store**: `redux/store.js` configures the one source of truth via
  `configureStore`.
- **`createSlice`**: `redux/postsSlice.js` defines `posts`, `loading`,
  `error`, and `selectedPlatform` state plus `addPost`, `updatePost`,
  `deletePost`, `clearComposer`, and `setPlatform` reducers.
- **Selectors & memoization**: `redux/selectors.js` exposes `selectPosts`,
  `selectPlatform`, and derived, memoized selectors
  (`selectCharacterLimit`, `selectRemainingCharacters`) built with
  `createSelector` so they only recompute when their inputs change.
- **React integration**: components use `useDispatch` and `useSelector`
  exclusively — no Context API.
