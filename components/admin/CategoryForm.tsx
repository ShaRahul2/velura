'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@prisma/client'
export function CategoryForm({ category }: {category:Category}) {
 const router=useRouter();const [busy,setBusy]=useState(false);const [message,setMessage]=useState('');const [error,setError]=useState('')
 async function save(e:FormEvent<HTMLFormElement>){
  e.preventDefault();const form=new FormData(e.currentTarget);setBusy(true);setError('');setMessage('')
  try { const res=await fetch(`/api/admin/catalog/categories/${category.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({label:form.get('label'),description:form.get('description'),imageUrl:form.get('imageUrl'),sortOrder:Number(form.get('sortOrder'))})});if(!res.ok)throw new Error((await res.json()).error);setMessage('Category saved.');router.refresh() }
  catch(e){setError(e instanceof Error?e.message:'Save failed.')}
  finally{setBusy(false)}
 }
 return <form onSubmit={save} className="space-y-4 rounded border border-[#413830] bg-[#1b1714] p-6"><p className="admin-eyebrow">{category.slug}</p><label className="block text-xs text-[#B8A898]">Display name<input required maxLength={100} name="label" defaultValue={category.label} className="admin-input mt-2" /></label><label className="block text-xs text-[#B8A898]">Description<textarea name="description" maxLength={2000} defaultValue={category.description??''} className="admin-input mt-2" /></label><label className="block text-xs text-[#B8A898]">Image URL<input type="url" name="imageUrl" placeholder="https://…" defaultValue={category.imageUrl??''} className="admin-input mt-2" /></label><label className="block text-xs text-[#B8A898]">Display order<input type="number" min={0} max={1000} required name="sortOrder" defaultValue={category.sortOrder} className="admin-input mt-2" /></label><button className="admin-button" disabled={busy}>{busy?'Saving…':'Save category'}</button>{message&&<p role="status" className="text-sm">{message}</p>}{error&&<p role="alert" className="text-sm text-red-300">{error}</p>}</form>
}
