'use server'

import { db } from "@/lib/database"
import { NextRequest } from "next/server"


export async function loginAction(formData) {

   const id_ = formData.get('id_')
   const pw_ = formData.get('pass_')

   const sql = `
      SELECT *
      FROM login
      WHERE mb_id = ?
      LIMIT 2
   `
   const data = await db(sql, [id_])


   
}