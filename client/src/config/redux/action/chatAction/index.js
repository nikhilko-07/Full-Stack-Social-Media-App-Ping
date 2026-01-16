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

export const createGroupChat = createAsyncThunk(
  "user/createGroup",
  async (data, thunkAPI) => {
    try {
      const raw = localStorage.getItem("token");
      const token = raw ? raw.replace(/['"]+/g, "") : null;

      const response = await clientServer.post(
        "/creatGroupChat",
        {
          users: JSON.stringify(data.users),
          name: data.name,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue("Error while creating GroupChat");
    }
  }
);

export const renameGroup = createAsyncThunk(
  "user/renameGroup",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const raw = raw ? raw.replace(/['"]+/g, "") : null;

      const response = await clientServer.put("/renameGroup", {
        chatId: data.chatId,
        chatName: data.chatName,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue("Error while renaming Group");
    }
  }
);

export const removeGroup = createAsyncThunk(
  "user/RemoveTheGroup",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const raw = raw ? raw.replace(/['"]+/g, "") : null;

      const response = await clientServer.put("/groupRemove", {
        chatId: data.chatId,
        userId: data.userId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue("Error while removing user");
    }
  }
);

export const addToTheGroup = createAsyncThunk(
  "user/addTogroup",
  async (data, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      const raw = raw ? raw.replace(/['"]+/g, "") : null;

      const response = await clientServer.put("/groupAdd", {
        chatId: data.chatId,
        userId: data.userId,
      });
      return thunkAPI.fulfillWithValue(response.data);
    } catch (err) {
      return thunkAPI.rejectWithValue("Error while Add a person");
    }
  }
);
