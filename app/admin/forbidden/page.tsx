import { redirect } from 'next/navigation'

export default function AdminForbiddenAlias() {
  redirect('/admin/denied')
}
