"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { Advanced } from 'loading-spinner-react';

interface cie_marks {
    CIE_Marks: {
        max_marks: number,
        obt_marks: number
    },
    Course: {
        course_name: string
    },
    id: number
}

export default function page() {

    const [loading, setLoading] = useState(true)
    const [cie_marks, setCieMarks] = useState<cie_marks[]>()

    useEffect(() => {
        fetch(`/api/cie_marks?student_usn=${Cookies.get('usn')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (data) => {
            setCieMarks((await data.json()).data)
            // console.log((await data.json()).data)
            setLoading(false)
        })
    }, [])

    return (
        <>
            <>
                <h1 className='text-center p-10 text-3xl'>CIE SCORE</h1>
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
                                <th className='p-4 border border-slate-800'>Max Marks</th>
                                <th className='p-4 border border-slate-800'>Obtained Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cie_marks?.map((att, index) => (
                                    <React.Fragment key={index}>
                                        {
                                            att.CIE_Marks && (

                                                <tr className='border border-slate-800'>
                                                    <td className='p-4 border border-slate-800'>{index + 1}</td>
                                                    <td className='p-4 border border-slate-800'>{att.Course?.course_name}</td>
                                                    <td className='p-4 border border-slate-800'>{att.CIE_Marks?.max_marks}</td>
                                                    <td className='p-4 border border-slate-800'>{att.CIE_Marks?.obt_marks}</td>
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
