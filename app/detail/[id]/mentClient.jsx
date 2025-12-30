'use client'
// ✅ 이 파일은 브라우저(클라이언트)에서 실행됨
// 이유: useState, onChange, form action(클라 핸들러) 같은 기능은 브라우저에서 동작함

import { useState } from "react"
import { createComment } from "./action"
import { useRouter } from "next/navigation"
// ✅ createComment는 server action(서버에서 실행되는 함수)
// 브라우저에서 폼을 제출하면 서버 action을 호출해서 DB에 저장함

export default function MentClient({ pageID, rows }) {
   const router = useRouter()
   // ✅ 부모(서버컴포넌트)에서 내려준 pageID, rows를 props로 받음
   // pageID: 현재 글의 id
   // rows: 해당 글의 댓글 목록(배열)

   // ✅ ment = 화면에 보여줄 "댓글 목록" 상태(state)
   // 처음값은 서버가 준 rows로 시작
   // 이렇게 해야 setment로 목록을 바꾸면 화면이 자동으로 다시 그려짐(리렌더)
   const [ment, setment] = useState(rows) //댓글

   // ✅ comment = 입력창에 적는 값 (controlled input)
   // React가 입력값을 state로 관리함
   const [comment, setComment] = useState("") // 입력할 댓글

   // ✅ form을 제출하면 실행되는 함수
   // form action={handleSubmit} 로 연결되어 있음
   async function handleSubmit(formData) {
      // formData 안에는 form의 input들이 들어있음
      // - name="pageID" 값
      // - name="comment" 값

      // ✅ 서버 action 실행 (DB에 댓글 저장)
      const result = await createComment(formData)

      // ✅ 서버에서 에러를 내려주면(로그인 필요/입력값 없음 등)
      if (result.status ==="NEED_LOGIN") {
         alert(result.message)
         // router.push('/login')
         location.href = "/login"
         
         return
         // return 안 하면 아래 코드가 계속 실행되므로 반드시 종료
      }
      if (result.status === "ERROR") {
         alert(result.message)
         return
      }

      // ✅ 여기부터는 댓글 작성 성공했을 때

      // ✅ 새로고침 없이 화면에 바로 댓글 추가
      // prev는 "이전 댓글 배열"을 의미
      // ...prev는 기존 댓글들 그대로 복사
      // { comment: comment }는 새로 추가할 댓글 1개
      setment(prev => [
         ...prev,
         { comment: comment }
      ])

      // ✅ 입력창 비우기
      setComment("")
   }

   return (
      <div>
         {/* ✅ action에 handleSubmit을 넣으면, submit 시 handleSubmit(formData)가 호출됨 */}
         <form action={handleSubmit}>
            {/* ✅ pageID를 서버 action으로 같이 보내기 위해 hidden input 사용 */}
            <input type="hidden" name="pageID" value={pageID} />

            {/* ✅ 댓글 입력창 (controlled input) */}
            <input
               name="comment"                     // formData.get("comment") 로 읽히는 이름
               value={comment}                     // 입력값은 state에서 가져옴
               onChange={(e) => setComment(e.target.value)}
               // ✅ 사용자가 타이핑할 때마다 state에 저장
               // state가 바뀌면 화면도 같이 갱신됨
               placeholder="댓글을 입력하세요"
            />

            <button type="submit">댓글작성</button>
         </form>

         <div>
            댓글<br />
            ===============================

            {/* ✅ ment 배열을 돌면서 화면에 댓글 출력 */}
            {ment.map((a, i) => (
               <div key={i}>
                  {a.comment}
               </div>
            ))}
         </div>
      </div>
   )
}
