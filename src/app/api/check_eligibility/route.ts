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

  // if (fQuery.data) {
  //     console.log(fQuery.data[0].Fee)
  // }

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

  // console.log(fee_paid)

  if (!fee_paid) {
    return NextResponse.json({
      message: "OK",
      see_eligibility: fee_paid,
      reason: `Fee not paid`,
    });
  }

  const acQuery = await supabase
    .from("Enrollments")
    .select(
      "id, Attendance(attendance_count, max_attendance), CIE_Marks(max_marks, obt_marks)"
    )
    .eq("student_id", student_id);
  const acData = acQuery.data;

  const check_attendance_and_cie = () => {
    let check = true;
    acData?.map((ac) => {
      let attendance = ac.Attendance;
      let cie_marks = ac["CIE_Marks"];
      if (cie_marks && !(cie_marks.obt_marks / cie_marks.max_marks > 0.4)) {
        check = false;
      }
      if (
        attendance &&
        !(attendance["attendance_count"] / attendance["max_attendance"] > 0.75)
      ) {
        check = false;
      }
    });
    return check;
  };

  const acCheck = check_attendance_and_cie();

  //   console.log(acData);

  return NextResponse.json({
    message: "OK",
    see_eligibility: fee_paid && acCheck,
    reason: {
      stmt: `Attendance and CIE marks ${acCheck ? "satisfactory" : "not satisfactory"}`,
      status: acCheck,
    },
  });
}
