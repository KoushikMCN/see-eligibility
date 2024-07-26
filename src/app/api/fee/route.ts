import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/../lib/supabase";

export async function GET(req: NextRequest) {
  const student_usn = req.nextUrl.searchParams.get("student_usn");
  const sidQuery = (
    await supabase.from("Student").select().eq("USN", student_usn)
  ).data;
  let student_id;
  if (sidQuery) {
    student_id = sidQuery[0].id;
  }
  const query = await supabase
    .from("Fee")
    .select()
    .eq("student_id", student_id);
  const { error, data } = query;
  console.log(data);
  if (error) {
    return NextResponse.json({ message: error });
  }
  return NextResponse.json({ message: "OK", data: data });
}

export async function PATCH(req: NextRequest) {
  const { fee_id } = await req.json();
  const fee_data = (
    await supabase
      .from("Fee")
      .select("paid_fee, outstanding_fee")
      .eq("id", fee_id)
  ).data;
  let newPaidFee;
  if (fee_data) newPaidFee = fee_data[0].paid_fee + fee_data[0].outstanding_fee;
  const { error, data } = await supabase
    .from("Fee")
    .update({ paid_fee: newPaidFee, outstanding_fee: 0 })
    .eq("id", fee_id)
    .select();
  console.log(data);
  return NextResponse.json({ message: "OK", data: data || error });
}
