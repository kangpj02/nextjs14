import { db } from "@/lib/database";
import { CreateComment } from "./action";
import { cookies } from "next/headers";
import Mentclient from "./mentClient";



export default async function Detail({params}) {

   // 1. 쿠키에서 토큰 꺼내기
   const cookieStore = cookies();
   const token = cookieStore.get('token')?.value; // 'token'이라는 이름의 쿠키를 가져옴

   const sql = `
      SELECT 
         t.id,
         t.title,
         t.content,
         c.comment,
         c.auth_id
      FROM test t
      LEFT JOIN comment c
         ON t.id = c.content_id
      WHERE t.id = ?
   `;
   const rows = await db(sql, [params.id]);

   if(!rows || rows.length === 0){
      return(
         <div>
            <h4>상세페이지임</h4>
            <p>데이터가 없습니다.</p>
         </div>

      )

   }

   return (
      <div>
         <h4>상세페이지임</h4>
         <h4>{rows[0].title}</h4>
         <p>{rows[0].content}</p>
         <Mentclient pageID = {params.id} rows = {rows}/>
{/* 
         <div>
            댓글<br/>
            ===============================
               {
                  rows.map((a, i)=>{
                     return(
                        <div key={i}>
                           {a.comment}
                           
                        </div>
                     )
                  })
               }
         </div> */}
      </div>
   )
}


