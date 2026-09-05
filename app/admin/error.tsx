'use client'
export default function AdminError({ reset }: { reset: () => void }) {
 return <div className="admin-page" role="alert"><h1 className="font-serif text-3xl">This view couldn’t load</h1><p className="my-4 text-[#B8A898]">The data service is unavailable. Retry to load the latest records.</p><button className="admin-button" onClick={reset}>Try again</button></div>
}
