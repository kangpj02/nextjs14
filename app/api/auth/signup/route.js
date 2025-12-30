const { db } = require("@/lib/database");
import bcrypt from "bcryptjs";

import { NextResponse } from "next/server"; // NextResponse 추가

export async function POST(req) {
   const formData = await req.formData();
   const id_ = formData.get('id_');
   const pw_ = formData.get('pass_');

   const saltRounds = 10;
   const hashedPassword = await bcrypt.hash(pw_, saltRounds);

   try {
      const sql = 'INSERT INTO login (mb_id, pass) VALUES (?, ?)';
      await db(sql, [id_, hashedPassword]);

      // ✅ 회원가입 성공 후 /login 페이지로 이동
      // 절대 경로를 포함한 URL 객체를 생성하여 전달합니다.
      return NextResponse.redirect(new URL('/login', req.url), { status: 303 });
      
   } catch (error) {
      console.error("회원가입 에러:", error);
      return NextResponse.json({ message: "가입 실패" }, { status: 500 });
   }
}