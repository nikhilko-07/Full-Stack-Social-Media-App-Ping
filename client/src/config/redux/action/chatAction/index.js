import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const accessTheChat = createAsyncThunk(
  "user/accessTheChat",
  async (profileId, thunkAPI) => {
    try {
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, "") : null;

      const response = await clientServer.post(
        "/accessChat",
        { profileId }, // ✅ body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Something wrong at accessChat Thunk"
      );
    }
  }
);

export const fetchTheChats = createAsyncThunk(
  "chat/fetchTheChats",
  async (_, thunkAPI) => {
    try {
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, "") : null;

      const response = await clientServer.get("/fetchChat", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Error while fetching chats");
    }
  }
);
