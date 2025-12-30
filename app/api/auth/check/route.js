import { cookies } from "next/headers"
// ✅ 서버에서 "요청에 포함된 쿠키"를 읽기 위한 함수
// (App Router route.js / 서버컴포넌트에서만 사용 가능)

import { NextResponse } from "next/server"
// ✅ Next.js에서 API 응답(Response)을 만들 때 쓰는 도구
// JSON 응답 만들기 + 쿠키 설정/삭제도 가능

import jwt from "jsonwebtoken"
// ✅ JWT 토큰을 검증(verify)하기 위한 라이브러리
// 토큰이 만료됐는지(exp), 위조됐는지 확인 가능


export async function GET() {
   // ✅ 브라우저가 요청할 때 같이 보낸 쿠키 중에서 "token" 꺼내기
   // token 쿠키가 없으면 undefined가 될 수 있어서 ?.value 사용
   const token = cookies().get("token")?.value

   // ✅ 토큰 쿠키 자체가 없으면 = 로그인 상태 아님
   // 여기서 valid:false 반환하면 AuthGuard가 로그인 페이지로 보내게 됨
   if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
   }

   try {
      // ✅ 토큰 검증
      // - 토큰이 "JWT_SECRET"으로 만들어진 게 맞는지(위조 방지)
      // - 토큰이 만료(exp)되지 않았는지 체크
      //
      // 검증 성공이면 에러 안나고 통과함
      jwt.verify(token, process.env.JWT_SECRET)

      // ✅ 토큰이 살아있으면 로그인 유지 상태
      return NextResponse.json({ valid: true })

   } catch {
      // ❌ 여기로 들어온다는 건
      // - 토큰 만료(exp 지난 경우)
      // - 토큰 위조/변조된 경우
      // - JWT_SECRET이 잘못된 경우(서버 설정 문제)
      //
      // 그래서 "로그아웃 처리"를 해줘야 함

      // ✅ 먼저 응답은 valid:false로 내려줌
      // 클라이언트(AuthGuard)는 이걸 보고 /login 으로 이동
      const res = NextResponse.json({ valid: false }, { status: 401 });

      // ✅ 쿠키 삭제 (중요)
      // JWT가 만료돼도 쿠키는 자동으로 안 지워짐
      // 그래서 여기서 직접 token 쿠키를 지움
      res.cookies.set("token", "", { maxAge: 0, path: "/" });
      res.cookies.set("session", "", { maxAge: 0, path: "/" });

      // ✅ 쿠키 삭제가 포함된 응답 반환
      return res
   }
}
