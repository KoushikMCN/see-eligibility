import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/../lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const sidQuery = (
    await supabase.from("Student").select().eq("USN", body.student_usn)
  ).data;

  let student_id;
  if (sidQuery) {
    student_id = sidQuery[0].id;
  }

  const query = await supabase
    .from("Enrollments")
    .select("id")
    .eq("student_id", student_id);
  const { error, data } = query;

  if (error) {
    return NextResponse.json({ message: error });
  }
  return NextResponse.json({ message: "OK", data: data });
}
