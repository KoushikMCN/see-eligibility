"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { Advanced } from 'loading-spinner-react';

interface eligibility {
    see_eligibility: boolean,
    reason: string[],
}

export default function page() {

    const router = useRouter();

    const [loading, setLoading] = useState(true)
    const [eligibility, setEligibility] = useState<eligibility>()

    useEffect(() => {
        fetch(`/api/check_eligibility?student_usn=${Cookies.get('usn')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(async (data) => {
            setEligibility((await data.json()))
            setLoading(false)
        })
    }, [])

    return (
        <>
            <>
                <h1 className='text-center p-10 text-3xl'>ELIGIBILITY</h1>
                {
                    loading &&
                    <div className='w-full flex justify-center items-center'>
                        <Advanced />
                    </div>
                }
                {
                    !loading &&
                    <>
                        <div className='flex flex-col items-center justify-center p-10 gap-5'>
                            <p>{eligibility?.see_eligibility ? "ELigible for SEE" : "Not eligible for SEE"}</p>
                            <ul>
                                {eligibility?.reason.map((reason, index) => (
                                    <li key={index} className='list-disc'>{reason}</li>
                                ))}
                            </ul>
                        </div>
                        {
                            eligibility?.reason[2] === "Fee not paid" &&
                            <div onClick={() => router.push('/fees')} className='flex flex-col items-center justify-center underline gap-5'>Pay Fee</div>
                        }
                    </>
                }
            </>
        </>
    );
}
