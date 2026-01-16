const { createSlice } = require("@reduxjs/toolkit");
const { getAllMessage, sendAMessage } = require("../../action/messageAction");

const initialState = {
  isError: false,
  isLoading: false,
  messgae: "",
  fetchedMessages:[]
};

const messageSlice = createSlice({
  name: "Message",
  initialState,
  reducers: {},
  extraReducer: (builder) => {
    builder
      .addCase(getAllMessage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Fetching The Messages...";
      })
      .addCase(getAllMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(getAllMessage.fulfilled, (state, action) => {
        state.message = "Fetched the Messages..";
        state.isError = false;
        state.pending = false;
        state.fetchedMessages = action.payload
      })
    //   ===============
    .addCase(sendAMessage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "Fetching The Messages...";
      })
      .addCase(sendAMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(sendAMessage.fulfilled, (state, action) => {
        state.message = "Fetched the Messages..";
        state.isError = false;
        state.pending = false;
      })
  },
});
