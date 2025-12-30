import { db } from "@/lib/database";
import Link from "next/link";
import ListPage from "./ListClient";


export default async function List() {

   const sql = "SELECT * FROM test ";
   const rows = await db(sql);

   return (
      
      <div className="list-bg">
         <ListPage data={rows} />
      

      </div>
   );
}
