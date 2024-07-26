"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { Advanced } from 'loading-spinner-react';

interface Attendance {
    attendance_count: number,
    id: number,
    max_attendance: number,
    enrollment_id: number,
}

interface Course {
    id: number,
    course_name: string
}

interface attendanceData {
    Attendance: Attendance,
    Course: Course,
    id: number
}

export default function page() {

    const [loading, setLoading] = useState(true)
    const [attendance, setAttendance] = useState<attendanceData[]>()

    useEffect(() => {
        fetch(`/api/attendance?student_usn=${Cookies.get('usn')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (data) => {
            setAttendance((await data.json()).data)
            // console.log((await data.json()).data)
            setLoading(false)
        })
    }, [])

    return (
        <>
            <>
                <h1 className='text-center p-10 text-3xl'>ATTENDANCE</h1>
                {
                    loading &&
                    <div className='w-full flex justify-center items-center'>
                        <Advanced />
                    </div>
                }
                <div className='flex flex-col items-center justify-center p-10 gap-5'>
                    <table className='table-auto bord border-spacing-8 border border-slate-500'>
                        <thead>
                            <tr>
                                <th className='p-4 border border-slate-800'>Sl.No</th>
                                <th className='p-4 border border-slate-800'>Course name</th>
                                <th className='p-4 border border-slate-800'>Total Classes</th>
                                <th className='p-4 border border-slate-800'>Classes Attended</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                attendance?.map((att, index) => (
                                    <React.Fragment key={index}>
                                        {
                                            att.Attendance && (

                                                <tr className='border border-slate-800'>
                                                    <td className='p-4 border border-slate-800'>{index + 1}</td>
                                                    <td className='p-4 border border-slate-800'>{att.Course?.course_name}</td>
                                                    <td className='p-4 border border-slate-800'>{att.Attendance?.max_attendance}</td>
                                                    <td className='p-4 border border-slate-800'>{att.Attendance?.attendance_count}</td>
                                                </tr>
                                            )
                                        }
                                    </React.Fragment>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </>
        </>
    );
}
