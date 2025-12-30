import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export default function HomePage() {

   // 1️⃣ 쿠키에서 token 꺼내기
   const token = cookies().get("token")?.value

   // 토큰이 없으면 로그인 안 된 상태
   if (!token) {
      return <div>로그인 안됨</div>
   }

   // 2️⃣ 토큰 검증 + payload 추출
   const decoded = jwt.verify(token, process.env.JWT_SECRET)

   // decoded 안에 들어있는 값 예시:
   // {
   //   mb_id: "test",
   //   mb_no: 3,
   //   iat: 1710000000,
   //   exp: 1710003600
   // }

   return (
      <div>
         <h2>로그인 정보</h2>
         <pre>{JSON.stringify(decoded, null, 2)}</pre>
      </div>
   )
}
