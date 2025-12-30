'use client';
import styles from "../auth/auth.module.css";


export default function LoginPage(){

   

   // e = 이벤트 객체(폼 submit 이벤트 정보가 들어있음)
   async function handleLogin(e) {
      // ✅ form submit 기본동작 막기
      // 기본동작: 폼을 submit하면 페이지가 새로고침됨(값 날아감)
      // fetch로 처리하고 싶으니까 새로고침을 막는 것
      e.preventDefault();

      // ✅ 이벤트가 발생한 대상(여기선 form)을 가져옴
      // <form onSubmit={handleLogin}> 에서 submit이 발생했기 때문에
      // e.target은 form 그 자체가 됨
      const form = e.target;

      // ✅ form 안에 있는 input들의 값을 꺼냄
      // input의 name="id_" 인 애를 form.id_ 로 접근 가능
      // input의 value(사용자가 입력한 값)를 가져옴
      const id_ = form.id_.value;
      const pass_ = form.pass_.value;

      // ✅ 서버(API)로 로그인 요청 보내기
      // /api/auth/login = Next.js의 API Route (route.js)
      // method POST = 로그인은 보통 POST로 보냄(비번 노출 방지 목적)
      const res = await fetch("/api/auth/login", {
         method:"POST",
         headers:{
            // ✅ 우리가 JSON으로 보낼거라서 서버에게 알려주는 표시
            "Content-Type":"application/json"
         },

         // ✅ 서버로 보낼 데이터
         // JS 객체를 JSON 문자열로 바꿔서 body에 넣어 보내야 함
         body: JSON.stringify({
            id_: id_,
            pass_: pass_
         })
      });

      // ✅ 서버가 응답으로 보내준 JSON을 다시 객체로 변환해서 받음
      // await res.json() 결과값 갤체중 result 만 빼서 변수 만듬
      const {result} = await res.json();
      console.log("결과",result)
      console.log(result, typeof result);

      // ✅ 로그인 성공/실패 처리
      if(result === 2){
         alert("로그인 성공");

         // ✅ 성공하면 메인으로 이동
         // location.href = 페이지 이동(새로고침 포함)
         location.href = "/";
         return;
      }
      else if(result === -1 || result === -2){
         alert("아이디 비번이 틀립니다");
         return;
      }
      else{
         alert("로그인이 실패 하였습니다");
      }
   }

      


   return(
      <div className={styles.login_wrap}>

         <div className={styles.login_box}>
            
            <h2 className={styles.login_title}>로그인</h2>

            <form onSubmit={handleLogin}>

               <input type="text" name="id_" className={styles.login_input} placeholder="아이디"/>
               <input type="password" name="pass_" className={styles.login_input} placeholder="비밀번호"/>

               <button className={styles.login_btn}>로그인</button>

            </form>

         </div>

      </div>
   );
}
