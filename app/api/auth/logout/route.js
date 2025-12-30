import { NextResponse } from "next/server";

export async function POST(req) {
   // 1. 먼저 응답 객체를 생성합니다.
   const response = NextResponse.json({
      message: "로그아웃 성공"
   });

   // 2. 응답 객체에 쿠키 삭제 설정을 추가합니다.
   response.cookies.set("token", "", {
      maxAge: 0,     // 즉시 만료
      path: "/",     // 모든 경로에서 유효하게 삭제
      httpOnly: true // 보안을 위해 추가하는 것을 권장합니다
   });

   // 3. 반드시 최종 수정된 response 객체를 리턴합니다.
   return response;
}