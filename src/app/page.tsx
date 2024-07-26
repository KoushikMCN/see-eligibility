"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie"
import { useRouter } from "next/navigation";

export default function Home() {

  const [usn, setUsn] = useState<string>()
  const [set, setSet] = useState<boolean>()
  const [name, setName] = useState<string>()
  // console.log(usn)
  const router = useRouter();

  useEffect(() => {
    setUsn(Cookies.get('usn'))
    setSet(Cookies.get('usn') ? true : false)
    if (Cookies.get('usn')) {
      fetch('/api/student', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ student_usn: Cookies.get('usn') })
      }).then(async (res) => {
        // console.log((await res.json()).data[0].student_name)
        setName((await res.json()).data[0].student_name)
      })
    }
  }, [])

  const setUsnCookie = () => {
    if (set) {
      Cookies.remove('usn')
      setSet(false)
      setUsn('')
      return
    }
    if (usn) {
      Cookies.set('usn', usn)
      setSet(true)
      fetch('/api/student', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ student_usn: Cookies.get('usn') })
      }).then(async (res) => {
        setName((await res.json()).data[0].student_name)
      })
      return
    }
    alert('Please enter your USN')
  }

  return (
    <main className=" p-24">
      <div className="fixed top-2 right-2">
        Your USN:
        <input type="text" placeholder="USN" className="bg-black text-white" value={usn} onChange={(e) => { setUsn(e.target.value.toUpperCase()); setSet(false) }} />
        <button onClick={() => setUsnCookie()} className="block border p-1 rounded-sm">{usn && set ? 'Remove' : 'Enter'}</button>
      </div>
      <div className="h-8 flex justify-center items-center">{name && name}</div>
      <div className="flex justify-center items-center">
          <div className="p-4 m-5 border-2 rounded-md text-center" onClick={() => { router.push('/attendance') }}>Attendance</div>
          <div className="p-4 m-5 border-2 rounded-md text-center" onClick={() => { router.push('/fees') }}>Fee Status </div>
          <div className="p-4 m-5 border-2 rounded-md text-center" onClick={() => { router.push('/cie') }}>CIE Marks</div>
          <div className="p-4 m-5 border-2 rounded-md text-center" onClick={() => { router.push('/eligibility') }}>SEE Eligibility</div>
        </div>
    </main>
  );
}
