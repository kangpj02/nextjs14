import styles from "../auth/auth.module.css";
export default function SignPage(){

   return(
      <div className={styles.login_wrap}>

         <div className={styles.login_box}>
            
            <h2 className={styles.login_title}>회원가입</h2>

            <form method="post" action="/api/auth/signup">

               <input type="text" name="id_" className={styles.login_input} placeholder="아이디"/>
               <input type="password" name="pass_" className={styles.login_input} placeholder="비밀번호"/>

               <button className={styles.login_btn}>회원가입</button>

            </form>

         </div>

      </div>
   );
}
