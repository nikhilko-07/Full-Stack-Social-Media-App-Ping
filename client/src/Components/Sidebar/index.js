import React from "react";
import {CirclePlus, HomeIcon, LogOut, MessageCircle, Search, User2Icon, Users} from "lucide-react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import styles from "./sidebar.module.css";
export default function Sidebar({children}) {
    return (<div className={styles.wrapperDiv} >
        <div className={styles.mainContainer} >
            <div className={styles.startDiv}  >
                <Image
                    className={styles.logo}
                    src={logo}
                    alt="logo"/>
            </div>
            <div
                className={styles.midDiv}
            >
                <button ><HomeIcon/>Feed</button>
                <button><MessageCircle/> Messages</button>
                <button ><Users/> Connections</button>
                <button ><Search/>Discover</button>
                <button ><User2Icon/> Profile</button>
                <button style={{color:"white"}} className={`${styles.button} ${styles.createPost}`}><CirclePlus/> Create Post</button>
            </div>

            <div className={styles.endDiv}>
                <p>username</p>
                <button ><LogOut/></button>
            </div>
        </div>
        {children}
    </div>)
}