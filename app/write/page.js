import { db } from "@/lib/database";
import { redirect } from "next/navigation";


export default function WritePage(){

   async function write(formData){
      'use server'
      const title = formData.get('title');
      const content = formData.get('content')

      const sql = "INSERT INTO test (title, content) VALUES (?, ?)"
      await db(sql, [title, content]);


      redirect('/list')
   }




  return (
    <div className="p-20">
      <h4>글작성</h4>
      <form action={write}>
      {/* <form action="/api/board" method="POST"> */}
         <input name="title" />
         <textarea name="content" />
         <button type="submit">전송</button>

      </form>
    </div>
  )
}