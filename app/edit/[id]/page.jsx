import { db } from "@/lib/database"
import { redirect } from "next/navigation";

import Btn from "./btnClient"


export default async function EditPage({params}) {
   
   async function edit(formData){
      'use server'
      
      const sql = "UPDATE test SET title = ?, content = ? WHERE id = ?";
      const title = formData.get('title')
      const content = formData.get('content')
      await db(sql,[title, content, params.id])

      redirect('/list')
   }
   
   const datasql = "SELECT * FROM test WHERE id = ? LIMIT 1";
   const list = await db(datasql, params.id)


   return (
      <div className="p-20">
         <h4>수정페이지</h4>
         <form action={edit} >
            <input name="title" defaultValue={list[0].title} />
            <input name="content" defaultValue={list[0].content}/>
            <button type="submit">서버전송</button>
         </form>
      </div>
   )
}