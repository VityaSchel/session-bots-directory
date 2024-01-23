export async function isSafe(text: string[]): Promise<boolean[]>
export async function isSafe(text: string): Promise<boolean>
export async function isSafe(text: string[] | string): Promise<boolean[] | boolean> {
  try {
    const request = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text
      })
    })
    if (request.status !== 200) {
      console.error(await request.text())
      return Array.isArray(text) ? new Array(text.length).fill(true) : true
    } else {
      const response = await request.json() as { results: { flagged: boolean }[] }
      return Array.isArray(text) ? response.results.map(result => !result.flagged) : !response.results[0].flagged
    }
  } catch(e) {
    console.error(e)
    return Array.isArray(text) ? new Array(text.length).fill(true) : true
  }
}