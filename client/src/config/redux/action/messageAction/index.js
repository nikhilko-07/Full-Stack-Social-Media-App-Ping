import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getAllMessage = createAsyncThunk(
    "user/getAllMessage",
    async(chatId, thunkAPI)=>{
        try{
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, ""): null;

            const response = await clientServer.get(
                "/chatId",{
                    headers:{Authorization:`Bearer ${token}`},
                    params:{chatId}
                }
            );
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err){
            return thunkAPI.rejectWithValue("Error while fetching all message");
        }
    }
)


export const sendAMessage = createAsyncThunk(
    "user/CreateMessage",
    async(data, thunkAPI)=>{
        try{
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, ""): null;

            const resposne = await clientServer.post("/sendMessage",
                {
                    content:data.content,
                    chatId:data.chatId
                },
                {
                    headers:{Authorization:`Bearer ${token}`}
                }
            );
            return thunkAPI.fulfillWithValue(resposne.data);
        }catch(err){
            return thunkAPI.rejectWithValue("Error while sending message")
        }
    }
)