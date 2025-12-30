'use client'

import { useRouter } from "next/navigation"

export default function Btn(){

   let router = useRouter()
   

   return (

      <div>
         <button type="submit" onClick={()=>{router.push('/list')}}>전송</button>
      </div>
      
   )
   

}
