import { db } from "@/lib/database";
import { cookies } from "next/headers";


export default function Home() {


   const cookieStore = cookies()
   const token = cookieStore.get('token')?.value;
   console.log("토큰",token)

   return (
      <div>
         
      </div>
   );
}
