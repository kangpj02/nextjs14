import { db } from "@/lib/database";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

export async function GET() {

   const sql = "SELECT * FROM test";
   const rows = await db(sql);

   return NextResponse.json({
      ok: true,
      result:rows
   });
}

export async function POST(req){

   const formdata = await req.formData()

   const title = formdata.get('title');
   const content = formdata.get('content');

   const sql = "INSERT INTO test (title, content) VALUES (?, ?)";
   await db(sql, [title, content])

   redirect('/list')
   
   return NextResponse.json({
      result: true
   })





}