import {createSlice} from "@reduxjs/toolkit";
import {createStory, getFollowingPersonStories, seeUserStories} from "@/config/redux/action/storyAction";


const initialState = {
    isError: false,
    isLoading: false,
    isSuccess:false,
    getFollowingStoriesData:{},
    followingStoiresFetched:false,
    userStoriesData:[],
    userStorieFetch:false
}

const storySlice = createSlice({
    name: "story",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createStory.pending, (state, action) => {
                state.isLoading = true;
                state.message = action.payload;
                state.isError = false;
            })
            .addCase(createStory.rejected, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
                state.isError = true;
            })
            .addCase(createStory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
                state.isError = false;
            })
            .addCase(getFollowingPersonStories.pending, (state, action) => {
                state.isLoading = true;
                state.message = action.payload;
                state.isError = false;
            })
            .addCase(getFollowingPersonStories.rejected, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
                state.isError = true;
            })
            .addCase(getFollowingPersonStories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
                state.isError = false;
                state.getFollowingStoriesData = action.payload;
                state.followingStoiresFetched = true;
            })
            .addCase(seeUserStories.pending, (state, action) => {
                state.isLoading = true;
                state.message = action.payload;
                state.isError = false;
            })
            .addCase(seeUserStories.rejected, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
                state.isError = true;
            })
            .addCase(seeUserStories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.message = action.payload;
                state.isError = false;
                state.userStoriesData = action.payload;
                state.userStorieFetch = true;
            })
    }
})
export default storySlice.reducer;