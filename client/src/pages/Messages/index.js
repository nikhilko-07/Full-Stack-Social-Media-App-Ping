import ClientLayout from "@/Layout/ClientLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOwnProfile, searchUser } from "@/config/redux/action/userAction";
import style from "./style.module.css";
import socket from "../socket/socket";
import { accessTheChat, fetchTheChats } from "@/config/redux/action/chatAction";
import {
  getAllMessage,
  sendAMessage,
} from "@/config/redux/action/messageAction";

export default function Messages() {
  const dispatch = useDispatch();

  /* ================= REDUX STATE ================= */
  const { searchResult, ownProfileData, searchLoading } = useSelector(
    (state) => state.auth
  );
  const { fetchedChats } = useSelector((state) => state.chats);
  const messages = useSelector((state) => state.message?.messages || []);

  const user = ownProfileData?.userId;

  /* ================= LOCAL STATE ================= */
  const [query, setQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    dispatch(getOwnProfile());
  }, [dispatch]);

  /* ================= FETCH CHATS ================= */
  useEffect(() => {
    dispatch(fetchTheChats());
  }, [dispatch]);

  /* ================= SOCKET SETUP ================= */
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("setup", user);

    const onConnect = () => {
      setSocketConnected(true);
    };

    const onMessageReceived = (msg) => {
      if (msg.chat._id === chatId) {
        dispatch({
          type: "ADD_MESSAGE",
          payload: msg,
        });
      }
    };

    socket.on("connected", onConnect);
    socket.on("message received", onMessageReceived);

    return () => {
      socket.off("connected", onConnect);
      socket.off("message received", onMessageReceived);
    };
  }, [user?._id, chatId, dispatch]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId) return;

    const res = await dispatch(sendAMessage({ content: newMessage, chatId }));
    socket.emit("new message", res.payload);
    setNewMessage("");
  };

  /* ================= SEARCH USER ================= */
  useEffect(() => {
    if (!query.trim()) return;

    const delay = setTimeout(() => {
      dispatch(searchUser(query));
    }, 400);

    return () => clearTimeout(delay);
  }, [query, dispatch]);

  /* ================= UI ================= */
  return (
    <ClientLayout>
      <div className={style.messageWrapper}>
        {/* ================= SIDEBAR ================= */}
        <div className={style.sidebarUsers}>
          <div className={style.queryContainer}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search User"
            />

            {query.trim() && (
              <div className={style.searchResultBox}>
                {searchLoading ? null : searchResult.length > 0 ? (
                  searchResult.map((user) => (
                    <div
                      key={user._id}
                      className={style.usersFetch}
                      onClick={async () => {
                        await dispatch(accessTheChat(user._id));
                        dispatch(fetchTheChats());
                        setQuery(""); // 🔥 close suggestions after click
                      }}
                    >
                      <img src={user.profilePicture} alt={user.name} />
                      <span>{user.name}</span>
                    </div>
                  ))
                ) : (
                  <p className={style.noUser}>No users found</p>
                )}
              </div>
            )}
          </div>

          <div className={style.chatedUsers}>
            {fetchedChats.map((chat) => (
              <div
                key={chat._id}
                className={style.chatUser}
                onClick={() => {
                  setChatId(chat._id);
                  dispatch(getAllMessage(chat._id));
                  socket.emit("join chat", chat._id);
                }}
              >
                <img src={chat?.users[1]?.profilePicture} />
                <span>{chat?.users[1]?.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CHAT ================= */}
        <div className={style.messageContainer}>
          <div className={style.chatsContainer}>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={
                  msg.sender._id === user?._id
                    ? style.myMessage
                    : style.theirMessage
                }
              >
                {msg.content}
              </div>
            ))}
          </div>

          {/* ================= INPUT ================= */}
          {chatId && (<div className={style.chatInput}>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>)}
        </div>
      </div>
    </ClientLayout>
  );
}
