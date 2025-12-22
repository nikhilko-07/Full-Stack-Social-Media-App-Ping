import ClientLayout from "@/Layout/ClientLayout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getAllUsers} from "@/config/redux/action/userAction";
import style from "./style.module.css";


export default function Messages(){
    const dispatch = useDispatch()
    const userState = useSelector(state => state.auth);
    const {getAllUsersList, getAllUsersData} = userState;

    useEffect(() => {
        dispatch(getAllUsers())
    },[dispatch])
    console.log(getAllUsersData);
    return(<ClientLayout>
        <div>
            {getAllUsersList && getAllUsersData.length > 0 ? (<div className={style.messageContainer}>
                {getAllUsersData?.map((data)=> <div className={style.userList}>
                    <p>{data.name}</p>
                </div>)}
            </div>) : null}
        </div>
    </ClientLayout>)


}