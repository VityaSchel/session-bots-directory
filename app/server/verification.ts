import { getDb } from '@/db'
import { nanoid } from 'nanoid'
import crypto from 'crypto'

export async function startVerification(botSessionId: string, userId: number) {
  const verifications = await getDb('verifications')
  const verificationInput = `/sessionbots.directory_verification ${nanoid()}`
  const verificationOutput = crypto.createHash('sha256').update(userId.toString()).digest('hex')
  await verifications.put(botSessionId, JSON.stringify({ 
    userId,
    verificationInput,
    verificationOutput
  }))
  return { verificationInput, verificationOutput }
}

export async function verifyBot(botSessionId: string): Promise<{ isVerified: true } | { isVerified: false, output: string }> {
  const verifications = await getDb('verifications')
  const verificationDb = await verifications.get(botSessionId)
  if (!verificationDb) throw new Error('Verification could not be found')

  const verification = JSON.parse(verificationDb) as { userId: number, verificationInput: string, verificationOutput: string }

  const verificationRequest = await fetch(process.env.BACKEND_URL + '/assert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: verification.verificationInput,
      output: verification.verificationOutput,
      sessionID: botSessionId
    })
  })
  const verificationResponse = await verificationRequest.json() as { ok: false } 
    | { ok: true, equals: true } 
    | { ok: true, equals: false, outputs: string[] }

  if (verificationResponse.ok) {
    if (verificationResponse.equals) {
      await verifications.del(botSessionId)
      return { isVerified: true }
    } else {
      return { isVerified: false, output: verificationResponse.outputs[0] }
    }
  } else {
    throw new Error('Could not verify bot' + JSON.stringify(verificationResponse))
  }
}

export async function getVerification(botSessionId: string) {
  const verifications = await getDb('verifications')
  const verificationDb = await verifications.get(botSessionId)
  if (!verificationDb) return null

  const verification = JSON.parse(verificationDb) as { userId: number, verificationInput: string, verificationOutput: string }
  return verification
}