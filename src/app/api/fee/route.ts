import { NextRequest, NextResponse } from "next/server";
import { supabase } from '@/../lib/supabase'

export async function GET(req:NextRequest) {
    const query = await supabase.from('Fee').select().eq('student_id', 1)
    const { error, data } = query
    console.log(data)
    if (error) {
        return NextResponse.json({ message: error })
    }
    return NextResponse.json({message: "OK", data: data})
}