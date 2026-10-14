// IndexedDB storage and in-memory cache for the 18 high-res user photos

const DB_NAME = 'our_journey_memory_vault';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

// In-memory quick lookup cache
let memoryPhotoCache: Record<number, string> = {};

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePhoto(photoId: number, dataUrl: string): Promise<void> {
  memoryPhotoCache[photoId] = dataUrl;
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id: photoId, dataUrl, updatedAt: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.warn('IndexedDB save failed, using memory cache:', e);
  }
}

export async function getPhoto(photoId: number): Promise<string | null> {
  if (memoryPhotoCache[photoId]) {
    return memoryPhotoCache[photoId];
  }
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(photoId);
      request.onsuccess = () => {
        if (request.result && request.result.dataUrl) {
          memoryPhotoCache[photoId] = request.result.dataUrl;
          resolve(request.result.dataUrl);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch (e) {
    console.error('Error getting photo from IndexedDB', e);
    return null;
  }
}

export async function getAllPhotos(): Promise<Record<number, string>> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => {
        const result: Record<number, string> = { ...memoryPhotoCache };
        if (Array.isArray(request.result)) {
          request.result.forEach((item) => {
            if (item && item.id && item.dataUrl) {
              result[item.id] = item.dataUrl;
              memoryPhotoCache[item.id] = item.dataUrl;
            }
          });
        }
        resolve(result);
      };
      request.onerror = () => resolve({ ...memoryPhotoCache });
    });
  } catch (e) {
    console.error('Error fetching all photos', e);
    return { ...memoryPhotoCache };
  }
}

export async function clearAllPhotos(): Promise<void> {
  memoryPhotoCache = {};
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (e) {
    console.error('Failed to clear photos from IndexedDB', e);
  }
}

export function parsePhotoNumber(fileName: string): number | null {
  const cleaned = fileName.trim();
  // 1. Exact match like "1.jpg", "17.JPG", "2.jpeg", "01.jpg"
  const exactMatch = cleaned.match(/^0?(\d{1,2})\.[a-zA-Z0-9]+$/);
  if (exactMatch) {
    const num = parseInt(exactMatch[1], 10);
    if (num >= 1 && num <= 18) return num;
  }
  // 2. Prefixes like "photo 1.jpg", "IMG_17.JPG", "1 - something.jpg", "Stage 8.jpg"
  const generalMatch = cleaned.match(/(?:photo|img|picture|stage|memory|\b|_|-|\s|^)0?(\d{1,2})(?:\.|\b|_|-|\s|\()/i);
  if (generalMatch) {
    const num = parseInt(generalMatch[1], 10);
    if (num >= 1 && num <= 18) return num;
  }
  // 3. Fallback: any 1 or 2 digit number
  const anyNumMatch = cleaned.match(/(\d{1,2})/);
  if (anyNumMatch) {
    const num = parseInt(anyNumMatch[1], 10);
    if (num >= 1 && num <= 18) return num;
  }
  return null;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Intelligently maps an array of uploaded files to stage slots 1 through 18.
 * First maps files that have explicit numbers (e.g. 1.JPG -> 1, 17.JPG -> 17).
 * Any remaining files are assigned to empty slots in sequential order.
 */
export async function smartAssignFiles(
  files: File[],
  existingPhotos: Record<number, string> = {}
): Promise<{ updatedMap: Record<number, string>; assignedCount: number }> {
  const updatedMap = { ...existingPhotos };
  let assignedCount = 0;

  const unassignedFiles: { file: File; url: string }[] = [];

  // Pass 1: files with recognized numbers in filename
  for (const file of files) {
    const num = parsePhotoNumber(file.name);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      if (num && num >= 1 && num <= 18) {
        await savePhoto(num, dataUrl);
        updatedMap[num] = dataUrl;
        assignedCount++;
      } else {
        unassignedFiles.push({ file, url: dataUrl });
      }
    } catch (err) {
      console.error('Error reading file', file.name, err);
    }
  }

  // Pass 2: assign any remaining unassigned files to empty slots
  for (let slot = 1; slot <= 18 && unassignedFiles.length > 0; slot++) {
    if (!updatedMap[slot]) {
      const next = unassignedFiles.shift();
      if (next) {
        await savePhoto(slot, next.url);
        updatedMap[slot] = next.url;
        assignedCount++;
      }
    }
  }

  return { updatedMap, assignedCount };
}
