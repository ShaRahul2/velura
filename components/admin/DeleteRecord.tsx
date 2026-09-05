'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export function DeleteRecord({ resource, id, label }: {resource:'reviews'|'subscribers';id:string;label:string}) {
 const router=useRouter(); const [busy,setBusy]=useState(false);const [error,setError]=useState('')
 async function remove() {
  if(!confirm(`Remove ${label}? This cannot be undone.`)) return
  setBusy(true);setError('')
  try { const res=await fetch(`/api/admin/catalog/${resource}/${encodeURIComponent(id)}`,{method:'DELETE'}); if(!res.ok) throw new Error((await res.json()).error || 'Could not remove record.');router.refresh() }
  catch(e){setError(e instanceof Error?e.message:'Could not remove record.')}
  finally{setBusy(false)}
 }
 return <><button className="admin-link min-h-11 text-sm" disabled={busy} onClick={remove}>{busy?'Removing…':'Remove'}</button>{error&&<p role="alert" className="text-sm text-red-300">{error}</p>}</>
}
