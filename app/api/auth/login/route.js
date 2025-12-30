import { db } from "@/lib/database"
import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import crypto from "crypto"



export async function POST(req) {

   // 1) 프론트에서 보낸 JSON 데이터를 꺼냄
   // 예: { "id_": "test", "pass_": "1234" }
   const { id_, pass_ } = await req.json()

   console.log(id_, pass_)

   // 2) DB에서 로그인 테이블 조회
   // mb_id가 사용자가 입력한 아이디와 같은 행을 가져옴
   // LIMIT 2 를 한 이유:
   // - 원래 아이디는 1개만 있어야 정상인데
   // - 만약 DB가 꼬여서 같은 아이디가 2개 이상이면 "이상상태"로 잡아내기 위해서
   const sql = `
      SELECT *
      FROM login
      WHERE mb_id = ?
      LIMIT 2
   `
   const data = await db(sql, [id_])

   // 3) 같은 아이디가 2개 이상이면 (DB 비정상)
   // 이런 경우는 로그인 진행하면 위험해질 수 있어서 차단
   if (data.length > 1) {
      return NextResponse.json({ result: -5 })
   }

   // 4) 아이디가 없으면 로그인 실패
   if (data.length === 0) {
      return NextResponse.json({ result: -1 })
   }

   // 5) DB에서 찾은 유저 정보 1개를 꺼냄
   const user = data[0]

	// =====================================================
   // ✅ bcrypt 비밀번호 비교 (여기가 핵심 변경 포인트)
   // =====================================================

   // user.pass
   // → DB에 저장된 "암호화된 비밀번호"
   //
   // pass_
   // → 사용자가 입력한 "평문 비밀번호"
   //
   // bcrypt.compare():
   // - 내부적으로 입력 비번화 암호화비번 비교 
   const isMatch = await bcrypt.compare(pass_, user.pass)

   // 비밀번호가 틀리면 로그인 실패
   if (!isMatch) {
      return NextResponse.json({ result: -2 })
   }

   // =====================================================
   // ✅ 여기부터가 "로그인 성공 후 JWT 발급" 파트
   // =====================================================

   // 7) JWT 토큰 생성
   // jwt.sign( payload, secretKey, options )
   //
   // payload(페이로드):
   // - 토큰 안에 넣을 "로그인한 사람의 정보"
   // - 이 정보는 이후 요청에서 "누가 로그인했는지" 확인할 때 사용됨
   //
   // secretKey(비밀키):
   // - 토큰이 위조되지 않았는지 검증할 때 사용
   // - 절대 코드에 직접 쓰지 말고 .env에 저장해야 함
   //
   // options:
   // - expiresIn: "1h" → 토큰 1시간 뒤 만료
   //
   // ✅ mb_id / mb_no 를 넣는 이유:
   // - 토큰으로 "로그인한 사람이 누구인지"를 알아야 함
   // - 최소한의 식별 정보가 필요
   //
   // mb_id: 사용자 아이디 (보통 화면/로그에 쓰기 좋음)
   // mb_no: 사용자 고유번호(숫자 PK) (DB 조인/권한 체크에 안정적)
   //
   // ✅ 왜 둘 다 넣을까?
   // - mb_id는 사람이 보기 쉬운 ID
   // - mb_no는 DB에서 변하지 않는 고유키(중복/변경 위험이 적음)
   // 예를 들어 mb_id가 나중에 변경될 수도 있다면
   // mb_no가 있으면 확실하게 같은 사람을 식별 가능
   const token = jwt.sign(
      {
         mb_id: user.mb_id,
         mb_no: user.id
      },
      process.env.JWT_SECRET,
      {expiresIn: "1m"}
   )

   //  세션 토큰 생성
   const sessionToken = crypto.randomUUID()

   //  세션 저장
   await db(
      `INSERT INTO sessions (user_id, token, expires_at)
      VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))`,
      [user.id, sessionToken]
   )

   // 8) 응답 객체를 만들고 (JSON으로 result:2 내려줌)
   // 이 응답에 "쿠키"를 같이 심어서 브라우저에 저장하게 함
   const res = NextResponse.json({
      result: 2
   })

   // 9) 쿠키 저장
   // 쿠키 이름: "token"
   // 값: 위에서 만든 JWT token
   res.cookies.set("token", token, {

      // httpOnly: true
      // - 자바스크립트로 document.cookie 로 읽을 수 없음
      // - XSS 공격에 강해짐 (권장)
      httpOnly: true,

      // secure: true
      // - HTTPS 에서만 쿠키 전송
      // - 개발환경(http://localhost)에서는 쿠키가 안 들어갈 수 있음
      // - 개발할 때는 NODE_ENV에 따라 false로 바꾸는 방식이 많음
      secure: process.env.NODE_ENV === "production",

      // path: "/"
      // - 사이트 전체 경로에서 이 쿠키 사용 가능
      path: "/",

      // maxAge: 60*60 (초)
      // - 쿠키 유효기간 1시간
      // - 토큰 expiresIn 1h 와 맞춰주는게 일반적
      maxAge: 60 * 60
   })

   // 🔹 세션 토큰 (실제 로그인 인증)
   res.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 // 1일
   })

   // 10) 쿠키가 포함된 응답을 반환
   return res
}
