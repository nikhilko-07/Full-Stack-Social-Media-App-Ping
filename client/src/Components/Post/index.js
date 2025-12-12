import {
  Bookmark,
  Heart,
  MessageCircleIcon,
  SendIcon,
  SquareX,
  Trash,
} from "lucide-react";
import { Carousel } from "../carousel";
import style from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createComment,
  deleteComment,
  deletePost,
  getComments,
  incrementLikes,
  savedPost,
} from "@/config/redux/action/postAction";
import { getOwnProfile } from "@/config/redux/action/userAction";
import { useState } from "react";
import { useRouter } from "next/router";

export const Post = ({ data, closeModal }) => {
  const userState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const { comments, commentsFetched } = postState;
  const [openCommentWindow, setOpenCommentWindow] = useState(false);
  const [input, setInput] = useState("");
  const { ownProfileData } = userState || {};

  const dispatch = useDispatch();

  const postdelete = async (data) => {
    await dispatch(deletePost(data._id));
    await closeModal();
    await dispatch(getOwnProfile());
  };
  
  const doComment = async(data) => {
    if (!input.trim()) return; // avoid empty comments
       await dispatch(createComment({ post_id: data, body: input }));
       await dispatch(getComments(data)); // refresh comments after creation
       setInput("");
  };
  const deleteCmnt = async(data)=>{
    await dispatch(deleteComment(data));
    await setOpenCommentWindow(false)
  }
  const router = useRouter();

  return (
    <div>
      <div>
       <div className={style.postHeader}>
         <p>{data.content}</p>
        {data.userId === ownProfileData.userId && router.pathname.startsWith("/Profile") && (
  <button onClick={() => postdelete(data)}>
    <Trash />
  </button>
)}
       </div>
        <div style={{ width: "400px" }}>
          <Carousel>
            {data.images.map((img, i) => (
              <img
                width={300}
                height={300}
                key={i}
                src={img.path}
                alt={`Post image ${i + 1}`}
                style={{
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
              />
            ))}
          </Carousel>
          <div className={style.postIcons}>
            <button
              className={style.likeBtn}
              onClick={() => {
                dispatch(incrementLikes(data._id));
              }}
            >
              <Heart />{data.likes.length}
            </button>
            <button
            className={style.cmtBtn}
              onClick={() => {
                setOpenCommentWindow(true);
                dispatch(getComments(data._id))
              }}
            >
              <MessageCircleIcon />
            </button>
            <button className={style.sendBtn}>
              <SendIcon />
            </button>
            <button
            className={style.saveBtn}
              onClick={() => {
                dispatch(savedPost(data._id));
              }}
            >
              <Bookmark />
            </button>
          </div>
          {openCommentWindow === true && (<div>
         <div className={style.cmtContainer}>
        {commentsFetched && comments?.length > 0 ? (
          comments.map((cmnt) => (
          
            <div className={style.comment} key={cmnt._id}>
              <div className={style.profilePicture}>
                <img src={cmnt.profilePicture} alt={cmnt.name} />
              </div>
              <div className={style.userInfo}>
                <h3>{cmnt.name}</h3>
                <p className={style.commentBody}>{cmnt.body}</p>
              </div>

              {/* 🔹 Show delete button only if the logged-in user owns this comment */}
              {cmnt.userId === ownProfileData?.userId && (
                <button
                  className={style.deleteBtn}
                  onClick={() => deleteCmnt(cmnt._id)}
                >
                  <Trash />
                </button>
              )}
            </div>
          ))
        ) : (
          <p style={{ paddingLeft: "2.5%", color: "gray" }}>No Comments</p>
        )}
      </div>

            <div className={style.createContainer}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Create Comment"
              />
              <button className={style.cmtBtn} onClick={()=>{doComment(data._id)}}>
                <SendIcon />
              </button>
              <button
                className={style.closeBtn}
                onClick={() => setOpenCommentWindow(false)}
              >
                <SquareX />
              </button>
            </div>
            </div>)}
        </div>
      </div>
    </div>
  );
};
