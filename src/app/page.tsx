"use client";
import { useState } from "react";
import Cookies from "js-cookie"

export default function Home() {

  const [usn, setUsn] = useState('')
  const [set, setSet] = useState(false)
  // console.log(usn)

  const setUsnCookie = () => {
    if (set) { 
      Cookies.remove('usn')
      setSet(false)
      return
    }
    if(usn){
      Cookies.set('usn', usn)
      setSet(true)
      return
    }
    alert('Please enter your USN')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="fixed top-2 right-2">
        Your USN:
        <input type="text" placeholder="USN" className="bg-black text-white" value={usn} onChange={(e)=>setUsn(e.target.value.toUpperCase())} />
        <button onClick={()=>setUsnCookie()} className="block border p-1 rounded-sm">{set? 'Unset' :usn? 'Set': 'Enter USN'}</button>
        </div>
      <div>Attendance</div>
      <div>Fee Status </div>
      <div>CIE Marks</div>
      <div>SEE Eligibility</div>
    </main>
  );
}
