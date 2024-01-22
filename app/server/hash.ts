import { scrypt, randomBytes } from 'crypto'

export async function compare(hash: string, plain: string): Promise<boolean> {
  const [salt, hashedInput] = hash.split('$')
  const hashedResult = await generateHashed(plain, salt)
  return hashedResult === hashedInput
}

export async function hash(plain: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const hashedResult = await generateHashed(plain, salt)
  return `${salt}$${hashedResult}`
}

const rounds = 100
async function generateHashed(plain: string, salt: string): Promise<string> {
  let hashedResult: string = ''
  for (let i = 0; i < rounds; i++) {
    hashedResult = await new Promise(resolve =>
      scrypt(plain, salt, 32, { N: 4096 }, (_, hash) =>
        resolve(hash.toString('hex'))
      )
    )
  }
  return hashedResult
}

// TEST
// const rar = new Array(100).fill(null).map(() => Math.random().toString(36).substring(2))
// for(const vvv of rar){await compare('a1f24ed2fc58f35462df28ebb04e730a$c3d3f5fdebe004920a4ec5d92a0279d21063ba19f2bde9bb0f5c20091ae42a66', vvv)}
// should take at least 100 seconds