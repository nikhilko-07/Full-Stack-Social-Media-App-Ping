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
    }
})


export default chatSlice.reducer;