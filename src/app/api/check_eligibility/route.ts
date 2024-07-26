import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/../lib/supabase";

export async function GET(req: NextRequest) {
  const student_usn = (req.nextUrl.searchParams).get('student_usn')
  const sidQuery = (await supabase.from("Student").select().eq("USN",student_usn)).data
  let student_id
  if (sidQuery) {
    student_id = sidQuery[0].id
  }
  const fQuery = await supabase
    .from("Student")
    .select("id, Fee(paid_fee, outstanding_fee)")
    .eq("id", student_id);

  const check_fee_paid = () => {
    let all_fees_paid = true;
    if (fQuery.data) {
      fQuery.data.map((fee) => {
        fee["Fee"].map((individual_fee) => {
          if (individual_fee.outstanding_fee !== 0) {
            // console.log(individual_fee.outstanding_fee)
            all_fees_paid = false;
          }
        });
      });
    }
    return all_fees_paid;
  };

  const fee_paid = check_fee_paid();

  // if (!fee_paid) {
  //   return NextResponse.json({
  //     message: "OK",
  //     see_eligibility: fee_paid,
  //     reason: `Fee not paid`,
  //   });
  // }

  const aQuery = await supabase
    .from("Enrollments")
    .select(
      "id, Attendance(attendance_count, max_attendance)"
    )
    .eq("student_id", student_id);
  const aData = aQuery.data;

  const check_attendance = () => {
    let check = true;
    aData?.map((a) => {
      let attendance = a.Attendance;
      if (
        attendance &&
        !(attendance["attendance_count"] / attendance["max_attendance"] > 0.75)
      ) {
        check = false;
      }
    });
    return check;
  };

  const aCheck = check_attendance();

  const cQuery = await supabase
    .from("Enrollments")
    .select(
      "id, CIE_Marks(max_marks, obt_marks)"
    )
    .eq("student_id", student_id);
  const cData = cQuery.data;

  const check_cie = () => {
    let check = true;
    cData?.map((c) => {
      let cie_marks = c["CIE_Marks"];
      if (cie_marks && !(cie_marks.obt_marks / cie_marks.max_marks > 0.4)) {
        check = false;
      }
    });
    return check;
  };

  const cCheck = check_cie();

  return NextResponse.json({
    message: "OK",
    see_eligibility: fee_paid && aCheck && cCheck,
    reason: [
    `Attendance ${aCheck ? "satisfactory" : "not satisfactory"}`,
    `CIE Marks ${cCheck ? "satisfactory" : "not satisfactory"}`,
    `Fee ${fee_paid ? "paid" : "not paid"}`
  ]
  });
}
