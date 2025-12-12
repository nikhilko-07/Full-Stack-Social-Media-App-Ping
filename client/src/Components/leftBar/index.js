import style from "./style.module.css";


export default function LeftBar(){
    return(<>
            <div className={style.mainContainer}>
                <div className={style.advt}></div>
                <div className={style.userList}></div>
            </div>
    </>)
}