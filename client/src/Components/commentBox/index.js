import {
  createComment,
  deleteComment,
  getComments,
} from "@/config/redux/action/postAction";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.css";
import { SendIcon, SquareX, Trash } from "lucide-react";

export const CommentBox = ({ onClose, data }) => {
  const dispatch = useDispatch();

  // ✅ Redux states
  const postState = useSelector((state) => state.posts);
  const userState = useSelector((state) => state.auth);
  const { ownProfileData } = userState || {};

  const { comments, commentsFetched } = postState;
  const [input, setInput] = useState("");

  // ✅ Fetch comments when component opens or post ID changes
  useEffect(() => {
    if (data) {
      dispatch(getComments(data));
    }
  }, [dispatch, data]);

  // ✅ Create new comment
  const doComment = async () => {
    if (!input.trim()) return; // avoid empty comments
    await dispatch(createComment({ post_id: data, body: input }));
    await dispatch(getComments(data)); // refresh comments after creation
    setInput("");
  };

  // ✅ Delete comment (only your own)
  const deleteCmnt = async (id) => {
    const result = await dispatch(deleteComment(id));
    if (deleteComment.rejected.match(result)) {
      alert("You are not authorized to delete this comment.");
      return;
    }
    await dispatch(getComments(data));
  };

  return (
    <div className={style.mainContainer}>
      {/* 🔹 Comments list */}
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

      {/* 🔹 Input and buttons */}
      <div className={style.createContainer}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Create Comment"
        />
        <button className={style.cmtBtn} onClick={doComment}>
          <SendIcon />
        </button>
        <button className={style.closeBtn} onClick={() => onClose(null)}>
          <SquareX />
        </button>
      </div>
    </div>
  );
};
