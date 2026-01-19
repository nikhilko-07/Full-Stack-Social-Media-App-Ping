import { createSlice } from "@reduxjs/toolkit";
import { getAllMessage, sendAMessage } from "../../action/messageAction";

const initialState = {
  isError: false,
  isLoading: false,
  message: "",
  messagesfetched: false,
  fetchedMessages: [],
};

const messageSlice = createSlice({
  name: "Message",
  initialState,

  // ✅ ADD THIS
  reducers: {
    ADD_MESSAGE: (state, action) => {
      // 🔥 IMMUTABLE UPDATE (UI RE-RENDER)
      state.fetchedMessages.push(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      // ================= GET ALL MESSAGES =================
      .addCase(getAllMessage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Fetching the messages...";
      })
      .addCase(getAllMessage.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getAllMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.message = "Fetched the messages";
        state.fetchedMessages = action.payload;
        state.messagesfetched = true;
      })

      // ================= SEND MESSAGE =================
      .addCase(sendAMessage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Sending the message...";
      })
      .addCase(sendAMessage.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(sendAMessage.fulfilled, (state) => {
        state.isLoading = false;
        state.isError = false;
        state.message = "Message sent";
      });
  },
});

// ✅ EXPORT ACTION
export const { ADD_MESSAGE } = messageSlice.actions;

export default messageSlice.reducer;
