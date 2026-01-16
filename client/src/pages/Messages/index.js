import ClientLayout from "@/Layout/ClientLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getOwnProfile,
  profileFetch,
  searchUser,
} from "@/config/redux/action/userAction";
import style from "./style.module.css";
import socket from "../socket/socket";
import { accessTheChat, fetchTheChats } from "@/config/redux/action/chatAction";
import {
  getAllMessage,
  sendAMessage,
} from "@/config/redux/action/messageAction";

export default function Messages() {
  const dispatch = useDispatch();

  const { searchResult, ownProfileData, searchLoading } = useSelector(
    (state) => state.auth
  );
  const { fetchedChats } = useSelector((state) => state.chats);
  const messageState = useSelector((state) => state.message);
  const { fetchedMessages, messagesfetched } = messageState;
  console.log(messagesfetched);

  const user = ownProfileData?.userId;

  /* ================= LOCAL STATE ================= */
  const [query, setQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState("");
  const [selectedUserData, setSelectedUserData] = useState({
    name: "",
    profilePicture: "",
  });
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
    dispatch(getAllMessage(chatId));
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
                        setQuery("");
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
                  // setSelectedUserData(chat._id)
                  setSelectedUserData({
                    name: chat.users[1].name,
                    profilePicture: chat.users[1].profilePicture,
                  });
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
          {/* ================= INPUT ================= */}
          {chatId && (
            <div>
              <div className={style.selectedUserTag}>
                <img src={selectedUserData.profilePicture} />
                <p>{selectedUserData.name}</p>
              </div>

              <div>
                <div className={style.chatsContainer}>
                  {fetchedMessages.map((msg) => (
                    <div className={style.messageRow}>
                      <div key={msg._id} className={style.messageThread}>
                        <img src={msg.sender.profilePicture} />
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={style.messageInputContainer}>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
