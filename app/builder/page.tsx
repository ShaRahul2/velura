import { CustomBraBuilder } from '@/components/builder/CustomBraBuilder'

export const metadata = {
  title: 'Custom',
  description: 'Made to order. A bra, or panties — size, cut, fabric, and colour.',
}

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ garment?: string | string[] }>
}) {
  const params = await searchParams
  const raw = Array.isArray(params.garment) ? params.garment[0] : params.garment
  const initialGarment = raw === 'panties' ? 'panties' : 'bra'
  return <CustomBraBuilder initialGarment={initialGarment} />
}
