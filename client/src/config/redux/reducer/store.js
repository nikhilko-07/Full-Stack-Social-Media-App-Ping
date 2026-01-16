import {configureStore} from "@reduxjs/toolkit";
import authReducer from "@/config/redux/reducer/userReducer";
import postReducer from "@/config/redux/reducer/postReducer";
import storyReducer from "@/config/redux/reducer/storyReducer";
import chatReducer from "@/config/redux/reducer/chatReducer";
export const store = configureStore({
    reducer: {
        auth: authReducer,
        posts: postReducer,
        story: storyReducer,
        chats: chatReducer
    }
})