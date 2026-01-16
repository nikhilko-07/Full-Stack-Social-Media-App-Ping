import { createSlice } from "@reduxjs/toolkit";
import { getAllMessage, sendAMessage } from "../../action/messageAction";

const initialState = {
  isError: false,
  isLoading: false,
  message: "",                // ✅ fixed typo
  messagesfetched: false,
  fetchedMessages: [],
};

const messageSlice = createSlice({
  name: "Message",
  initialState,
  reducers: {},
  extraReducers: (builder) => {      // ✅ FIXED
    builder
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
        state.isLoading = false;      // ✅ FIXED
        state.isError = false;
        state.message = "Fetched the messages";
        state.fetchedMessages = action.payload;
        state.messagesfetched = true; // ✅ THIS WILL NOW WORK
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
        state.isLoading = false;      // ✅ FIXED
        state.isError = false;
        state.message = "Message sent";
      });
  },
});

export default messageSlice.reducer;
