
import React, {useState} from "react";
import ClientLayout from "@/Layout/ClientLayout";
import { createAPost } from "@/config/redux/action/postAction";
import {useDispatch} from "react-redux";

export default function createPost(){
    const dispatch = useDispatch();
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);

    const handleFilesChange = (e) => {
        const selected = Array.from(e.target.files || []);
        setFiles(selected);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert("Content is required");
            return;
        }
        if (!files.length) {
            alert("Please select at least one image");
            return;
        }

        dispatch(createAPost({ content, files }));
    };

    return(<ClientLayout>
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                maxWidth: "500px",
                margin: "0 auto",
                padding: "1rem 1.25rem",
                backgroundColor: "#111827",          // dark card
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
                border: "1px solid #1f2937",
            }}
        >
  <textarea
      placeholder="What's on your mind?"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      rows={4}
      style={{
          width: "100%",
          padding: "0.75rem 0.85rem",
          borderRadius: "8px",
          border: "1px solid #374151",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          fontSize: "0.95rem",
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
      }}
  />

            <label
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontSize: "0.85rem",
                    color: "#9ca3af",
                    cursor: "pointer",
                    width: "fit-content",
                }}
            >
    <span
        style={{
            padding: "0.35rem 0.7rem",
            borderRadius: "999px",
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            fontSize: "0.8rem",
        }}
    >
      + Add images
    </span>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFilesChange}
                    style={{ display: "none" }}       // hide default ugly input
                />
                {files.length > 0 && (
                    <span style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
        {files.length} selected
      </span>
                )}
            </label>

            <button
                type="submit"
                style={{
                    marginTop: "0.25rem",
                    alignSelf: "flex-end",
                    padding: "0.45rem 1.1rem",
                    borderRadius: "999px",
                    border: "none",
                    background:
                        "linear-gradient(135deg, #6366f1, #ec4899)", // indigo → pink
                    color: "#f9fafb",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    boxShadow: "0 8px 18px rgba(79,70,229,0.4)",
                }}
            >
                Create Post
            </button>
        </form>

    </ClientLayout>)
}