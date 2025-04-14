import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser:null,
  isLoggedIn: false,
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    updateCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    updateStatus: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    addMessages: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { updateCurrentUser, updateStatus, addMessages, clearMessages } =
  chatSlice.actions;

export default chatSlice.reducer;
