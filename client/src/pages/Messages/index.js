import ClientLayout from "@/Layout/ClientLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getOwnProfile,
  searchUser,
} from "@/config/redux/action/userAction";
import style from "./style.module.css";
import socket from "../socket/socket";
import { accessTheChat, fetchTheChats } from "@/config/redux/action/chatAction";
import {
  getAllMessage,
  sendAMessage,
} from "@/config/redux/action/messageAction";
import { ADD_MESSAGE } from "@/config/redux/reducer/messageReducer";

export default function Messages() {
  const dispatch = useDispatch();

  const { searchResult, ownProfileData, searchLoading } = useSelector(
    (state) => state.auth
  );
  const { fetchedChats } = useSelector((state) => state.chats);
  const { fetchedMessages } = useSelector((state) => state.message);

  const user = ownProfileData;

  const activeChatIdRef = useRef(null);

  /* ================= LOCAL STATE ================= */
  const [query, setQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatId, setChatId] = useState("");
  const [showChatScreen, setShowChatScreen] = useState(false);

  const [selectedUserData, setSelectedUserData] = useState({
    name: "",
    profilePicture: "",
  });

  /* ================= INIT ================= */
  useEffect(() => {
    dispatch(getOwnProfile());
    dispatch(fetchTheChats());
  }, [dispatch]);

  useEffect(() => {
    activeChatIdRef.current = chatId;
  }, [chatId]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("setup", user);

    socket.on("message received", (msg) => {
      if (msg.chat._id === activeChatIdRef.current) {
        dispatch(ADD_MESSAGE(msg));
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [user?._id, dispatch]);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const res = await dispatch(
      sendAMessage({ content: newMessage, chatId })
    );

    socket.emit("new message", res.payload);
    dispatch(ADD_MESSAGE(res.payload));

    setNewMessage("");
  };

  /* ================= SEARCH ================= */
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
        <div
          className={`${style.sidebarUsers} ${
            showChatScreen ? style.hideOnMobile : ""
          }`}
        >
          <div className={style.queryContainer}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search User"
            />

            {query.trim() && (
              <div className={style.searchResultBox}>
                {searchLoading ? null : searchResult.length ? (
                  searchResult.map((u) => (
                    <div
                      key={u._id}
                      className={style.usersFetch}
                      onClick={() => {
                        dispatch(accessTheChat(u._id));
                        dispatch(fetchTheChats());
                        setQuery("");
                      }}
                    >
                      <img src={u.profilePicture} />
                      <span>{u.name}</span>
                    </div>
                  ))
                ) : (
                  <p className={style.noUser}>No users found</p>
                )}
              </div>
            )}
          </div>

          <div className={style.chatedUsers}>
            {fetchedChats.map((chat) => {
              const otherUser =
                chat.users[0]._id === user._id
                  ? chat.users[1]
                  : chat.users[0];

              return (
                <div
                  key={chat._id}
                  className={style.chatUser}
                  onClick={() => {
                    setChatId(chat._id);
                    setShowChatScreen(true);
                    setSelectedUserData({
                      name: otherUser.name,
                      profilePicture: otherUser.profilePicture,
                    });

                    dispatch(getAllMessage(chat._id));
                    socket.emit("join chat", chat._id);
                  }}
                >
                  <img src={otherUser.profilePicture} />
                  <span>{otherUser.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= CHAT ================= */}
        <div
          className={`${style.messageContainer} ${
            showChatScreen ? style.showOnMobile : ""
          }`}
        >
          {chatId && (
            <>
              {/* HEADER */}
              <div className={style.selectedUserTag}>
                <button
                  className={style.backBtn}
                  onClick={() => {
                    setShowChatScreen(false);
                    setChatId("");
                  }}
                >
                  ←
                </button>

                <img src={selectedUserData.profilePicture} />
                <p>{selectedUserData.name}</p>
              </div>

              {/* MESSAGES */}
              <div className={style.chatsContainer}>
                {fetchedMessages.map((msg) => (
                  <div key={msg._id} className={style.messageRow}>
                    <div className={style.messageThread}>
                      <img src={msg.sender.profilePicture} />
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT */}
              <div className={style.messageInputContainer}>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type message..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
