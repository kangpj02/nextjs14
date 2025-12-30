import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

/*
   🔐 Edge Runtime에서는 process.env.JWT_SECRET을
   그대로 쓰면 안 되고,
   반드시 Uint8Array로 변환해야 함
*/
const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(req) {

   /*
      1️⃣ 요청 경로(pathname)
      예:
      - /login
      - /admin
      - /admin/user
      - /mypage
   */
   const { pathname } = req.nextUrl;
   console.log("2222222222222",req)

   /*
      2️⃣ HttpOnly 쿠키에 저장된 JWT 토큰 꺼내기
      - 로그인 성공 시 서버에서 이미 쿠키로 저장됨
      - 브라우저가 자동으로 모든 요청에 포함해서 보냄
   */
   const token = req.cookies.get("token")?.value

   /*
      3️⃣ 보호할 경로 정의
      - 이 경로들은 "로그인 필수"
   */
   const isProtected =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/mypage")

   /*
      4️⃣ 이미 로그인한 사용자가 /login 접근하면
         메인 페이지로 돌려보내기 (UX + 보안)
   */
   if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/", req.url))
   }

   /*
      5️⃣ 보호 대상이 아닌 페이지면
         그냥 통과 (로그인 검사 안 함)
   */
   if (!isProtected) {
      return NextResponse.next()
   }

   /*
      6️⃣ 보호 페이지인데 토큰이 없다?
         → 로그인 안 한 상태
         → /login으로 이동
   */
   if (!token) {
      return NextResponse.redirect(
         new URL("/login", req.url)
      )
   }

   /*
      7️⃣ 토큰 검증 (jose)
      - 만료(exp) 자동 체크
      - 위조 토큰이면 에러 발생
   */
   try {
       // ✅ 토큰 검증
      await jwtVerify(token, secret)

      // ✅ 정상 토큰 → 접근 허용
      return NextResponse.next()

   } catch (err) {

      /*
         8️⃣ 토큰 에러 상황
         - 만료됨
         - 위조됨
         - secret 불일치
         → 다시 로그인 유도
      */
      const res =  NextResponse.redirect(
         new URL("/login", req.url)
      )

      // ✅ 쿠키 삭제 설정 (반드시 res 객체에 설정 후 return)
      res.cookies.set("token", "", { maxAge: 0, path: "/" });
      res.cookies.set("session", "", { maxAge: 0, path: "/" });

      return res

   }
}

/*
   9️⃣ middleware 적용 대상 경로
   - 이 경로에서만 middleware가 실행됨
   - 불필요한 전체 실행 방지 (성능 중요)
*/
export const config = {
   matcher: [
      "/admin/:path*",
      "/mypage/:path*",
      "/login"
   ]
}
