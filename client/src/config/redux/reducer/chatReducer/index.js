import { createSlice } from "@reduxjs/toolkit";
import { accessTheChat, fetchTheChats, createGroupChat, renameGroup, removeGroup, addToTheGroup } from "@/config/redux/action/chatAction";



const initialState = {
    loading:false,
    isError:false,
    message:"",
    accessedChats:[],
    fetchedChats:[]
}

const chatSlice = createSlice({
    name:"Chat",
    initialState,
    reducers:{

    },
    extraReducers:(builder) =>{
        builder
            .addCase(accessTheChat.rejected,(state, action)=>{
                state.isError = true;
                state.message = "Something went wrong at accessing the chats";
            })
             .addCase(accessTheChat.pending,(state, action)=>{
                state.isError = false;
                state.message = "Accessing the chat...";
                state.loading = true;
            })
             .addCase(accessTheChat.fulfilled,(state, action)=>{
                state.isError = false;
                state.message = "Accessed the chats";
                state.accessedChats = action.payload;
            })
            // =========================
            .addCase(fetchTheChats.rejected,(state, action)=>{
                state.isError = true;
                state.message = "Something wrong at Fetching chats";
            })
             .addCase(fetchTheChats.pending,(state, action)=>{
                state.isError = false;
                state.message = "Accessing the chat...";
                state.loading = true;
            })
             .addCase(fetchTheChats.fulfilled,(state, action)=>{
                state.isError = false;
                state.message = "Accessed the chats";
                state.fetchedChats = action.payload
            })
            // =========================
            .addCase(createGroupChat.rejected,(state, action)=>{
                state.isError = true;
                state.message = action.payload;
            })
             .addCase(createGroupChat.pending,(state, action)=>{
                state.isError = false;
                state.message = "Accessing the chat...";
                state.loading = true;
            })
             .addCase(createGroupChat.fulfilled,(state, action)=>{
                state.isError = false;
                state.message = state.action;
            })
            // =========================
            .addCase(renameGroup.rejected,(state, action)=>{
                state.isError = true;
                state.message = action.payload;
            })
             .addCase(renameGroup.pending,(state, action)=>{
                state.isError = false;
                state.message = "Accessing the chat...";
                state.loading = true;
            })
             .addCase(renameGroup.fulfilled,(state, action)=>{
                state.isError = false;
                state.message = state.action;
            })
            // =========================
            .addCase(removeGroup.rejected,(state, action)=>{
                state.isError = true;
                state.message = action.payload;
            })
             .addCase(removeGroup.pending,(state, action)=>{
                state.isError = false;
                state.message = "Accessing the chat...";
                state.loading = true;
            })
             .addCase(removeGroup.fulfilled,(state, action)=>{
                state.isError = false;
                state.message = state.action;
            })
            // =========================
            .addCase(addToTheGroup.rejected,(state, action)=>{
                state.isError = true;
                state.message = action.payload;
            })
             .addCase(addToTheGroup.pending,(state, action)=>{
                state.isError = false;
                state.message = "Accessing the chat...";
                state.loading = true;
            })
             .addCase(addToTheGroup.fulfilled,(state, action)=>{
                state.isError = false;
                state.message = state.action;
            })
    }
})


export default chatSlice.reducer;