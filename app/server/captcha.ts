export async function verifyCaptcha(token: string): Promise<boolean> {
  if (!process.env.HCAPTCHA_SECRET_KEY) throw new Error('HCAPTCHA_SECRET_KEY is not defined')

  const request = await fetch('https://api.hcaptcha.com/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      secret: process.env.HCAPTCHA_SECRET_KEY,
      response: token
    })
  })
  if(request.status !== 200) return false
  try {
    const response = await request.json() as { success: boolean }
    return response.success
  } catch(e) {
    return false
  }
}