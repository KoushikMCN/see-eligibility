import { NextRequest, NextResponse } from "next/server";
import { supabase } from '@/../lib/supabase'

export async function GET(req:NextRequest) {
    const student_usn = (req.nextUrl.searchParams).get('student_usn')
    const sidQuery = (await supabase.from("Student").select().eq("USN",student_usn)).data
    let student_id
    if (sidQuery) {
        student_id = sidQuery[0].id
    }
    const aQuery = await supabase.from('Enrollments').select('id, Attendance(*), Course(*)').eq('student_id', student_id)
    const aData = aQuery.data

    if (aData) {
        console.log(aData)
    }

    return NextResponse.json({message: "OK", data: aData})
}