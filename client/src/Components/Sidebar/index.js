import React, {useEffect} from "react";
import { CirclePlus, HomeIcon, LogOut, MessageCircle, Search, User2Icon, Users } from "lucide-react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import {useDispatch, useSelector} from "react-redux";

export default function Sidebar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);

    const currentPath = router.pathname;

    const handleClick = (path) => {
        router.push(path);
    };
    const [createPostWindow, setCreatePostWindow] = React.useState(false);
    const [content, setContent] = React.useState("");
    const [files, setFiles] = React.useState([]);

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


    return (
            <div className={styles.mainContainer}>

                <div className={styles.startDiv}>
                    <Image className={styles.logo} src={logo} alt="logo" />
                </div>

                <div className={styles.midDiv}>
                    <button
                        className={`${styles.btn} ${currentPath === "/feed" ? styles.activeBtn : ""}`}
                        onClick={() => handleClick("/feed")}
                    >
                        <HomeIcon /> Feed
                    </button>

                    <button
                        className={`${styles.btn} ${currentPath === "/Messages" ? styles.activeBtn : ""}`}
                        onClick={() => handleClick("/Messages")}
                    >
                        <MessageCircle /> Messages
                    </button>

                    <button
                        className={`${styles.btn} ${currentPath === "/Discover" ? styles.activeBtn : ""}`}
                        onClick={() => handleClick("/Discover")}
                    >
                        <Search /> Discover
                    </button>

                    <button
                        className={`${styles.btn} ${currentPath === "/Profile" ? styles.activeBtn : ""}`}
                        onClick={() => handleClick("/Profile")}
                    >
                        <User2Icon /> Profile
                    </button>

                    <button
                        style={{ color: "white" }}
                        className={`${styles.btn} ${styles.createPost}`}
                        onClick={() => handleClick("/createPost")}
                    >
                        <CirclePlus /> Create Post
                    </button>
                </div>


                <div className={styles.endDiv}>
                    {authState ? (
                        <p>{authState.ownProfileData.name}</p>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <button className={styles.logOutBtn} onClick={()=>{
                        localStorage.removeItem("token");
                        router.push("/");
                    }}>
                        <LogOut />
                    </button>
                </div>


            </div>

    );
}
