// 로컬 데이터 암호화 — PIN 기반 AES-GCM (WebCrypto).
// ⚠️ PIN 분실 시 데이터 복구 불가. 의사·약국 명칭 등 민감 정보 보호용.

function base64ToBuf(b: string): ArrayBuffer {
  const bin = atob(b)
  const u = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i)
  return u.buffer
}

function bufToBase64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf)
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s)
}

async function deriveKey(pin: string, salt: BufferSource): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export interface EncryptedBlob {
  enc: true
  salt: string
  iv: string
  data: string
}

export async function encryptText(text: string, pin: string): Promise<EncryptedBlob> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(pin, salt)
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text))
  return { enc: true, salt: bufToBase64(salt), iv: bufToBase64(iv), data: bufToBase64(ct) }
}

export async function decryptText(blob: EncryptedBlob, pin: string): Promise<string | null> {
  try {
    const key = await deriveKey(pin, base64ToBuf(blob.salt))
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBuf(blob.iv) }, key, base64ToBuf(blob.data))
    return new TextDecoder().decode(pt)
  } catch {
    return null
  }
}

export function isEncryptedBlob(v: unknown): v is EncryptedBlob {
  return !!v && typeof v === 'object' && (v as { enc?: unknown }).enc === true
}
