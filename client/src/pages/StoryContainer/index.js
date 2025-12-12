import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.css";
import React, { useEffect, useRef } from "react";
import {createStory, getFollowingPersonStories, seeUserStories} from "@/config/redux/action/storyAction";

export const StoryContainer = () => {
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.auth);
    const storyState = useSelector((state) => state.story);

    const { ownProfileData } = userState || {};
    const { getFollowingStoriesData, followingStoiresFetched, userStoriesData, userStorieFetch} = storyState || {};

    const [storieWindowAdd, setStorieWindowAdd] = React.useState(false);
    const [filedata, setFile] = React.useState(null);
    const [UserStory, setUserStory] = React.useState(false);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handleNext = () => {
        const total = userStoriesData?.length || 0;
        if (total === 0) return;

        setCurrentIndex(prev =>
            prev === total - 1 ? 0 : prev + 1
        );
    };

    const handlePrev = () => {
        const total = userStoriesData?.length || 0;
        if (total === 0) return;

        setCurrentIndex(prev =>
            prev === 0 ? total - 1 : prev - 1
        );
    };


    const scrollRef = useRef(null);

    useEffect(() => {
        dispatch(getFollowingPersonStories());
    }, [dispatch]);

    const handleUpload = async () => {
        if (!filedata) {
            alert("Please select a file first!");
            return;
        }
        try {
            await dispatch(createStory(filedata));
            setStorieWindowAdd(false);
            setFile(null);
            dispatch(getFollowingPersonStories());
        } catch (error) {
            console.error("Upload failed");
        }
    };

    const handleScroll = (offset) => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollLeft += offset;
    };

    return (
        <div className={style.storiesWrapper}>
            <button
                type="button"
                className={style.scrollBtn1}
                onClick={() => handleScroll(-150)}
            >
                ◀
            </button>

            <div className={style.storiesContainer} ref={scrollRef}>
                <div className={style.storiesRow}>
                    <div className={style.addStory}>
                        <img
                            src={
                                ownProfileData?.profilePicture ||
                                "https://via.placeholder.com/80x120/ddd?text=+"
                            }
                            alt="Add Story"
                        />
                        <div
                            className={style.addStoryOverlay}
                            onClick={() => setStorieWindowAdd(true)}
                        />
                    </div>

                    {followingStoiresFetched &&
                        getFollowingStoriesData?.map((story) => (
                            <div key={story._id} className={style.usersStory}>
                                <img
                                    src={story?.profileId?.profilePicture}
                                    alt={story?.profileId?.name}
                                    className={style.storyImg}
                                    onClick={()=>{
                                        dispatch(seeUserStories(story?.profileId?._id)),
                                        setUserStory(true)}}
                                />
                            </div>
                        ))}
                </div>
            </div>
            <button
                type="button"
                className={style.scrollBtn2}
                onClick={() => handleScroll(150)}
            >
                ▶
            </button>

            {storieWindowAdd && (
                <div className={style.addStoryContainer}>
                    <div>
                        <div className={style.modal}>
                            <button
                                className={style.closeBtn}
                                onClick={() => setStorieWindowAdd(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={style.storyaddbtnContainer}>
                            <p className={style.addStoryheader}>Add New Story</p>
                            <label className={style.fileLabel}>
                                <span className={style.fileBadge}>+ Choose Image</span>
                                <input
                                    className={style.fileInput}
                                    onChange={(e) => setFile(e.target.files[0])}
                                    type="file"
                                    accept="image/*"
                                />
                            </label>
                            {filedata && <p className={style.storyFileName}>Selected: {filedata.name}</p>}
                            <button  className={style.uploadStoryBtn} onClick={handleUpload} disabled={!filedata}>
                                {filedata ? "Upload Story" : "Choose Image"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {UserStory && (
                <div className={style.usersStoryContainer}>
                    <div>
                        <button
                            className={style.closeStory}
                            onClick={() => {
                                setUserStory(false);
                                setCurrentIndex(0);
                            }}
                        >
                            X
                        </button>

                        <div className={style.userStoryArray}>
                            {userStorieFetch && userStoriesData.length > 0 && (
                                <>
                                    <button
                                        className={style.navBtn + " " + style.navLeft}
                                        onClick={handlePrev}
                                    >
                                        ◀
                                    </button>

                                    <img
                                        className={style.userStoryImg}
                                        src={userStoriesData[currentIndex]?.imageUrl.path}
                                        alt={`Story ${currentIndex + 1}`}
                                    />

                                    <button
                                        className={style.navBtn + " " + style.navRight}
                                        onClick={handleNext}
                                    >
                                        ▶
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
