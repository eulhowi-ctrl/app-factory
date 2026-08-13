// 사진 저장소 — IndexedDB (localStorage 5MB 한계 극복, 수 GB 가능)
import { newId } from './store'
import type { AppData } from './types'

const DB_NAME = 'symptomly-photos'
const STORE = 'photos'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function savePhoto(id: string, dataURL: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(dataURL, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getPhoto(id: string): Promise<string | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(id)
    req.onsuccess = () => resolve((req.result as string) ?? null)
    req.onerror = () => reject(req.error)
  })
}

export async function deletePhoto(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/** 기존 인라인(base64, 'data:') 사진을 IndexedDB로 이전 → 갱신된 데이터 반환 */
export async function migrateInlinePhotos(data: AppData): Promise<AppData> {
  const dedupe = new Map<string, string>()
  let changed = false

  const migrateList = <T extends { photo?: string }>(list: T[]): T[] =>
    list.map((item) => {
      if (item.photo && item.photo.startsWith('data:')) {
        changed = true
        let id = dedupe.get(item.photo)
        if (!id) {
          id = newId()
          dedupe.set(item.photo, id)
          void savePhoto(id, item.photo)
        }
        return { ...item, photo: id }
      }
      return item
    })

  return { ...data, symptoms: migrateList(data.symptoms), meds: migrateList(data.meds) }
}
