'use server'

import { db } from "@/lib/database"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken" // jwt 임포트 필요

export async function createComment(formData) {
   const comment = formData.get("comment")
   const pageID = formData.get("pageID")
   console.log("페이지",pageID)

   if (!comment) return { status: "ERROR", message: "댓글을 입력하세요." }

   // 1. 쿠키에서 암호화된 토큰 가져오기
   const cookieToken = cookies().get("token")?.value 

   if (!cookieToken) {
      return { status: "NEED_LOGIN", message: "로그인이 필요합니다." }
   }

   try {
      // 2. 토큰 해독 (로그인 시 사용한 JWT_SECRET 사용)
      const decoded = jwt.verify(cookieToken, process.env.JWT_SECRET);

      console.log(decoded)
      
      // decoded 안에는 mb_id, mb_no가 들어있습니다.
      const mb_id = decoded.mb_id; 

      // 3. DB 저장 (작성자 ID인 mb_id를 함께 저장)
      const sql = `
         INSERT INTO comment (content_id, auth_id, comment, created_at)
         VALUES (?, ?, ?, NOW())
      `;
      await db(sql, [pageID, mb_id, comment, ]);

      return { status: "SUCCESS", message: "댓글이 작성되었습니다." }
   } catch (err) {
      // 토큰이 만료되었거나 조작된 경우
      return { error: "인증 정보가 유효하지 않습니다." }
   }
}