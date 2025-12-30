import { db } from "@/lib/database";
import { NextResponse } from "next/server"



export async function DELETE(req, {params}){
   
   try{
      
      const id_ = params.id;
      const sql = "DELETE FROM test WHERE id = ?";
      const result = await db(sql, [id_]);
      
      // await new Promise(r=> setTimeout(r,8000));

      if(!result.affectedRows){
         return NextResponse.json({
            result: false,
            error: "삭제할 테이터 없음"
         }, {status:400})
      }
      

      console.log("삭제성공",id_)
      return new Response(null,{status: 204}) 

   }catch(err){

      console.log("삭제 에러:",err)

      return NextResponse.json({
         result: false,
         error: err.message
      },{status:500})
   }


}


