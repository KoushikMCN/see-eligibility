import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/../lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const sidQuery = (
    await supabase.from("Student").select().eq("USN", body.student_usn)
  ).data;

  return NextResponse.json({ message: "OK", data: sidQuery });
}
