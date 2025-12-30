'use client';

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (!data.valid) {
          // 특정 보호 경로에서만 알림을 띄우고 이동
          if (pathname.startsWith('/admin') || pathname.startsWith('/mypage')) {
            alert("로그인이 만료되었습니다.");
            router.replace("/login");
          }
        }
      } catch (err) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // 로딩 중일 때 하얀 화면이나 스피너를 보여주어 깜빡임 방지
  if (loading && (pathname.startsWith('/admin') || pathname.startsWith('/mypage'))) {
    return <div className="loading-screen">인증 확인 중...</div>;
  }

  return children;
}