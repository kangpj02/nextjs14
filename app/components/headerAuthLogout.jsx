'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HeaderAuthButton({ token }) {

   const router = useRouter();

   // ✅ 로그인 상태 관리
   const [isLogin, setIsLogin] = useState(!!token);

   // ✅ 최초 마운트 시 로그인 유효성 체크
   useEffect(() => {
      async function checkAuth() {
         const res = await fetch("/api/auth/check", {
            cache: "no-store"
         });

         if (res.status === 401) {
            setIsLogin(false);
            router.refresh(); 
         }
      }

      checkAuth();
   }, []);


   async function handleLogout() {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
         alert("로그아웃 되었습니다");
         router.push("/login"); // 로그아웃 후 로그인 페이지로 이동
         router.refresh();      // 토큰 상태 업데이트를 위해 페이지 새로고침(Soft refresh)
      }
   }

   if (!token) {
      // 🔹 페이지 이동이므로 Link 사용
      return (
         <Link href="/login" className="auth-btn">
            로그인
         </Link>
      );
   }

   // 🔹 특정 함수 실행이므로 button 사용 (스타일링을 위해 className 추가 권장)
   return (
      <button onClick={handleLogout} className="auth-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}>
         로그아웃
      </button>
   );
}