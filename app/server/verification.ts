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

export async function verifyBot(botSessionId: string, userId: number) {
  const verifications = await getDb('verifications')
  let verificationDb: string
  try {
    verificationDb = await verifications.get(botSessionId)
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error) {
        if (error.code === 'LEVEL_NOT_FOUND') {
          return null
        }
      }
    }
    throw error
  }

  const verification = JSON.parse(verificationDb) as { userId: number, verificationInput: string, verificationOutput: string }

  await new Promise(resolve => setTimeout(resolve, 2000))

  if(true) {
    await verifications.del(botSessionId)
    return true 
  }
}

export async function getVerification(botSessionId: string) {
  const verifications = await getDb('verifications')
  let verificationDb: string
  try {
    verificationDb = await verifications.get(botSessionId)
  } catch (error) {
    if (error instanceof Error) {
      if ('code' in error) {
        if (error.code === 'LEVEL_NOT_FOUND') {
          return null
        }
      }
    }
    throw error
  }

  const verification = JSON.parse(verificationDb) as { userId: number, verificationInput: string, verificationOutput: string }
  return verification
}