"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { Advanced } from '../../../node_modules/loading-spinner-react';

interface fee {
  id: number,
  paid_fee: number,
  outstanding_fee: number,
  student_id: number
}

export default function page() {

  const [loading, setLoading] = useState(true)
  const [fees, setFees] = useState<fee[]>()

  useEffect(() => {
    fetch(`/api/fee?student_usn=${Cookies.get('usn')}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (data) => {
      setFees((await data.json()).data)
      setLoading(false)
    })
  }, [])

  const payFee = (id: number, index: number) => {
    setLoading(true)
    fetch('/api/fee', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fee_id: id })
    }).then(async (res) => {
      let resData = (await res.json()).data[0]
      console.log(resData)
      setFees(prevFees => prevFees?.with(index, resData))
      console.log(fees?.with(index, resData))
      // setTimeout(() => setLoading(false), 1000)
      setLoading(false)
    })
  }

  return (
    <>
      <>
        <h1 className='text-center p-10 text-3xl'>FEES</h1>
        {
          loading &&
          <div className='w-full flex justify-center items-center'>
            <Advanced />
          </div>
        }
        <div className='flex flex-col items-center justify-center p-10 gap-5'>
          <table className='table-auto bord border-spacing-8 border border-slate-500'>
            {
              !loading && (
                <>
                  <thead>
                    <tr>
                      <td className='p-4 border border-slate-800'>Sl.No</td>
                      <td className='p-4 border border-slate-800'>Fee ID</td>
                      <td className='p-4 border border-slate-800'>Paid Fee</td>
                      <td className='p-4 border border-slate-800'>Outstanding Fee</td>
                      <td className='p-4 border border-slate-800'>Student ID</td>
                      <td className='p-4 border border-slate-800'>Pay Fee</td>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      fees?.map((fee, index) => (
                        <tr key={index}>
                          <td className='p-4 border border-slate-600'>{index + 1}</td>
                          <td className='p-4 border border-slate-600'>{fee.id}</td>
                          <td className='p-4 border border-slate-600'>{fee.paid_fee}</td>
                          <td className='p-4 border border-slate-600'>{fee.outstanding_fee}</td>
                          <td className='p-4 border border-slate-600'>{fee.student_id}</td>
                          <td className='p-4 border border-slate-600'>{fee.outstanding_fee ? <button className='text-center p-4' onClick={() => payFee(fee.id, index)}>Pay fee</button> : '--'}</td>
                        </tr>
                      )
                      )
                    }
                  </tbody>
                </>
              )
            }
          </table>
        </div>
      </>
    </>
  );
}
