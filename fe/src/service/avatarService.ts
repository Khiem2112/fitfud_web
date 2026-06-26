export const saveAvatarToDB = (userId: string, blob: Blob): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FitFudDB', 1);
    
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('avatars')) {
        db.createObjectStore('avatars');
      }
    };

    request.onsuccess = (e: any) => {
      const db = e.target.result;
      // In case the store doesn't exist but version is 1
      if (!db.objectStoreNames.contains('avatars')) {
        db.close();
        // Need to upgrade version to create store
        const upgradeReq = indexedDB.open('FitFudDB', 2);
        upgradeReq.onupgradeneeded = (e2: any) => {
          e2.target.result.createObjectStore('avatars');
        };
        upgradeReq.onsuccess = (e2: any) => {
          const db2 = e2.target.result;
          const tx = db2.transaction('avatars', 'readwrite');
          tx.objectStore('avatars').put(blob, userId);
          tx.oncomplete = () => resolve();
          tx.onerror = () => reject(tx.error);
        };
        return;
      }

      const tx = db.transaction('avatars', 'readwrite');
      const store = tx.objectStore('avatars');
      store.put(blob, userId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };
    
    request.onerror = () => reject(request.error);
  });
};

export const getAvatarFromDB = (userId: string): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FitFudDB', 1);
    
    request.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('avatars')) {
        db.createObjectStore('avatars');
      }
    };

    request.onsuccess = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('avatars')) {
        resolve(null);
        return;
      }
      const tx = db.transaction('avatars', 'readonly');
      const store = tx.objectStore('avatars');
      const getReq = store.get(userId);
      getReq.onsuccess = () => resolve(getReq.result || null);
      getReq.onerror = () => reject(getReq.error);
    };
    
    request.onerror = () => reject(request.error);
  });
};
