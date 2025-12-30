'use client'
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation"; 

export default function ListPage({ data }) {

   // 2️⃣ 라우터 훅 선언
   const router = useRouter();
   const [list, setList] = useState(data);

   async function deletePost(id, e){

      // 1. DOM 선택
      const item = e.target.closest(".list-item");

      // 2. 사라지는 class 추가 (애니메이션)
      item.classList.add("list-item-out");

      // 3. 1초 대기
      await new Promise(res => setTimeout(res, 1000));

      // 4. fetch 실행
      const res = await fetch(`/api/board/${id}`, {
         method:"DELETE",
      });

      // 5. 성공 시 처리
      if(res.status === 204){
         // 화면(State)에서 즉시 제거 (사용자에게 빠름)
         setList(prev => prev.filter(v => v.id !== id));
         
         router.refresh(); 
      }

      if(res.status === 400){
         console.log(res)
         alert("삭제실패");
         // 실패했으면 사라지게 했던 효과 취소
         item.classList.remove("list-item-out");
      }
   }

   return(
      <div>
         {list.map(item => (
            <div className="list-item" key={item.id}>
               <div>
                  <Link href={`/detail/${item.id}`} className="list-btn">
                     <h4>{item.title}</h4>
                  </Link>
               </div>
               <div>
                  <Link href={`/edit/${item.id}`} className="list-btn">✏️</Link>
               </div>
               <span onClick={(e)=> deletePost(item.id, e)} style={{cursor: "pointer"}}>
                  🗑️
               </span>
            </div>
         ))}
      </div>
   )
}