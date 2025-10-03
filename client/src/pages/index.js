import ClientLayout from "@/Layout/ClientLayout/index"
import bgImg from "@/assets/bgimg.png";
import Logo from "@/assets/logo.png";
import group from "@/assets/group.png";
import {Star} from "lucide-react";
import {useState} from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import styles from "./home.module.css";

export default function Home() {

  const[isLoggedIn, setIsLoggedIn] = useState(true);

  const router = useRouter();
  // useEffect(() => {
  //     router("/feed");
  // },[]);
  return (
      <div className={styles.layoutcontainer}>
        <Image src={bgImg} alt="" className={styles.backgroundimg} />
        {/* Left side */}
        <div className={styles.leftcolumn}>
          <Image src={Logo} alt="" className={styles.logoimg}/>
          <div>
            <div className={styles.headericons}>
              <Image src={group} alt="" className={styles.groupimg}/>
              <div>
                <div className={styles.starsrow}>
                  {Array(5).fill(0).map((_, i) => (<Star key={i} className={styles.staricon}/>))}
                </div>
                <p>Used by 12k+ developers</p>
              </div>
            </div>
            <h1 className={styles.gradientheading}>More than just friends truly connect</h1>
            <p className={styles.description}>connect with global community on ping.</p>
          </div>
          <span className={styles.placeholder}></span>
        </div>
        <div className={styles.rightcolumn}>
          <div className={styles.formwrapper}>
            <div className={styles.formcontent}>
              <div className={styles.formheader}>
                <h1>{isLoggedIn ? "Sign in" : "Sign up"}</h1>
                <span>Welcome back! Please {isLoggedIn ? "Sign in" : "Sign up"} to continue</span>
              </div>
              <div className={styles.formfields}>
                {
                  !isLoggedIn ? (
                      <>
                        <input  placeholder="Name"/>
                        <input  placeholder="Email"/>
                        <input type="password"  placeholder="Password"/>
                      </>
                  ) : (<>
                    <input placeholder="Email"/>
                    <input type="password" placeholder="Password"/></>)
                }              </div>
              <div className={styles.formactions}>
                <button className={styles.gradientbutton}>continue</button>
              </div>
              <div className={styles.formlinks}>
                {isLoggedIn ? (<p>if you not have an account.</p>) : (<p>if you have already an account.</p>)}<a style={{color:"blue", cursor:"pointer"}} onClick={()=>(setIsLoggedIn(!isLoggedIn))}>{isLoggedIn ? (<div>Create Account.</div>) : (<div>Login</div>)}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

  );

}
