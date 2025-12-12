import {createAsyncThunk} from "@reduxjs/toolkit";
import {clientServer} from "@/config";


export const createStory = createAsyncThunk(
    "user/createStory",
    async (file, thunkAPI) => {
        try {
            const token = localStorage.getItem("token")?.replace(/['"]+/g, "");
            const formData = new FormData();
            formData.append("file", file);
            console.log("Sending field name:", Array.from(formData.keys()));  // DEBUG

            const response = await clientServer.post("/createStory", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data);
        }
    }
);


export const getFollowingPersonStories = createAsyncThunk(
    "user/getFollowingPersonStories",
    async (_, thunkAPI) => {
        try {
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            const response = await clientServer.get("/getFollowingUserStories",{
                headers: {Authorization: `Bearer ${token}`,}
            })
            return response.data;
        }catch(err) {
            return thunkAPI.rejectWithValue({message:"Something went wrong at getUserStories"})
        }
    }
)

export const seeUserStories = createAsyncThunk(
    "user/seeUserStories",
    async (profiledata, thunkAPI) => {
        try {
            console.log(profiledata)
            const raw = localStorage.getItem("token");
            const token = raw ? raw.replace(/['"]+/g, "") : null;
            const response = await clientServer.get("/checkUserStory",{
                params:{profile_id:profiledata},
                headers: {Authorization: `Bearer ${token}`,}
            })
            return thunkAPI.fulfillWithValue(response.data);
        }catch(err) {
            return thunkAPI.rejectWithValue(err);
        }
    }
)