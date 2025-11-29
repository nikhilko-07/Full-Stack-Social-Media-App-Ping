    import {
    deletePost,
    getRandomPost,
    incrementLikes,
    getRandMedia,
    getComments,
    createComment,
    deleteComment,
    savedPost,
    getPostInfo,
        getSavedPostInfo
    } from "@/config/redux/action/postAction";
    import {createSlice} from "@reduxjs/toolkit";


    const initialState = {
        randPostsGet: false,
        isError: false,
        isLoading: false,
        message: "",
        randPosts: [],
        previouslySeenIds: [],
        previousSeenMedia:[],
        randMedia:[],
        mediaFetched:false,
        comments:[],
        commentsFetched:false,
        postData:[],
        savedPostData:[],
    }

    const postSlice = createSlice({
        name: "post",
        initialState,
        reducers: {

        },
        extraReducers:(builder) => {
            builder
                .addCase(getRandomPost.pending, (state) => {
                    state.isLoading = true;
                    state.isError = false;
                    state.message = "Fetching random posts...";
                })
                .addCase(getRandomPost.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.randPosts = [...state.randPosts, ...action.payload.posts];
                    state.previouslySeenIds = action.payload.nextPreviouslySeenIds;
                })
               .addCase(getRandMedia.fulfilled, (state, action) => {
                    state.message = "Fetched the media..";
                    state.isError = false;
                    state.pending = false;
                    state.randMedia = [...state.randMedia, ...action.payload.posts];
                    state.previousSeenMedia = action.payload.nextPreviouslySeenMedia; // ✅ fix this key name
                    state.mediaFetched = true;
                })
                .addCase(getRandomPost.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload || "Failed to fetch posts";
                })
                .addCase(deletePost.pending, (state, action) => {
                    state.isLoading = true;
                    state.isError = false;
                })
                .addCase(deletePost.fulfilled, (state, action) => {
                    state.randPosts = state.randPosts.filter(
                        (post) => post._id !== action.meta.arg // action.meta.arg = postId
                    );
                    state.message = "Post deleted successfully";
                })
                .addCase(deletePost.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload || "Failed to delete posts...";
                })
                .addCase(incrementLikes.pending, (state, action) => {
                    state.isLoading = true;
                    state.isError = false;
                })
                .addCase(incrementLikes.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = action.payload || "Failed to increment posts...";
                })
                .addCase(incrementLikes.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isError = false;
                    state.message = action.payload || "Done increment like...";
                })
                .addCase(getRandMedia.rejected, (state, action) => {
                    state.isError = true;
                    state.message = "Something went wrong...";
                })
                .addCase(getRandMedia.pending, (state, action) =>{
                    state.message = "Knocking the door...";
                    state.isError = false;
                    state.pending = true;
                })
                .addCase(getComments.pending, (state, action) =>{
                    state.message = "Knocking the door...";
                    state.isError = false;
                    state.pending = true;
                    state.commentsFetched = false;
                })
                .addCase(getComments.rejected, (state, action) => {
                    state.isError = true;
                    state.commentsFetched = false;
                    state.message = "Something went wrong...";
                })
                .addCase(getComments.fulfilled, (state, action)=>{
                    state.comments = action.payload.comments;
                    state.isLoading = false;
                    state.isError = false;
                    state.message = "Done Fetch Comments...";
                    state.commentsFetched = true
                })
                .addCase(createComment.rejected, (state, action)=>{
                    state.isLoading = false;
                    state.isError = true;
                    state.message = "Something went wrong..."
                })
                .addCase(createComment.pending, (state, action)=>{
                    state.isError = false;
                    state.isLoading = true;
                    state.message = "Knocking the door..."
                })
                .addCase(createComment.fulfilled, (state, action)=>{
                    state.isError = false;
                    state.isLoading = false;
                    state.message = "Created the Comment";
                })
                .addCase(deleteComment.rejected, (state, action)=>{
                    state.isLoading = false;
                    state.isError = true;
                    state.message = "Something went wrong..."
                })
                .addCase(deleteComment.pending, (state, action)=>{
                    state.isError = false;
                    state.isLoading = true;
                    state.message = "Knocking the door..."
                })
                .addCase(deleteComment.fulfilled, (state, action)=>{
                    state.isError = false;
                    state.isLoading = false;
                    state.message = "Comment deleted...";
                })
                .addCase(savedPost.pending, (state, action) => {
                    state.isError = false;
                    state.isLoading = true;
                    state.message = "Knocking the door..."
                })
                .addCase(savedPost.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = "Something went wrong..."
                })
                .addCase(savedPost.fulfilled, (state, action) => {
                    state.isError = false;
                    state.isLoading = false;
                    state.message = "Done save item";
                })
                .addCase(getPostInfo.pending, (state, action) => {
                    state.isError = false;
                    state.isLoading = true;
                    state.message = "Knocking the door..."
                })
                .addCase(getPostInfo.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = "Something went wrong..."
                })
                .addCase(getPostInfo.fulfilled, (state, action) => {
                    state.isError = false;
                    state.isLoading = false;
                    state.message = "Fetched Post Data";
                    state.postData = action.payload;
                })
                .addCase(getSavedPostInfo.pending, (state, action) => {
                    state.isError = false;
                    state.isLoading = true;
                    state.message = "Knocking the door..."
                })
                .addCase(getSavedPostInfo.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;
                    state.message = "Something went wrong..."
                })
                .addCase(getSavedPostInfo.fulfilled, (state, action) => {
                    state.isError = false;
                    state.isLoading = false;
                    state.message = "Fetched Post Data";
                    state.savedPostData = [
                        ...state.savedPostData.filter(p => p._id !== action.payload._id),
                        action.payload
                    ];
                })
        }
    })
    export default postSlice.reducer;