function fromAddress(): string {
  return process.env.ORDER_FROM_EMAIL ?? 'VELURA <hello@thevelura.in>'
}

function htmlFromText(text: string): string {
  const body = text
    .trim()
    .split('\n')
    .map((line) => (line ? `<p style="margin:0 0 12px;line-height:1.5">${escapeHtml(line)}</p>` : '<div style="height:8px"></div>'))
    .join('')
  return `<div style="font-family:Georgia,serif;color:#0F0D0B;background:#F8F6F3;padding:32px">
  <p style="letter-spacing:0.22em;font-size:12px;color:#B8A898">VELURA</p>
  <div style="margin-top:24px;font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;color:#6B6058">${body}</div>
</div>`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => (c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;'))
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

export async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    if (process.env.NODE_ENV !== 'production') console.info('[notify:email:skipped]', { to, subject })
    return
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: fromAddress(), to: [to], subject, text, html: htmlFromText(text) }),
    })
    if (!res.ok) console.error('[notify:email]', res.status, await res.text().catch(() => ''))
  } catch (err) {
    console.error('[notify:email]', err)
  }
}
